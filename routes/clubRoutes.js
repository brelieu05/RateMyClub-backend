const express = require('express');

const clubRoutes = express.Router();

const pool = require('../db');

clubRoutes.use(express.json());


clubRoutes.get("/", async (req, res) => {
    try {
        const clubs = await pool.query(
            "SELECT DISTINCT club_name FROM reviews WHERE club_name IS NOT NULL AND club_name <> ''"
        );
        const clubNames = clubs.rows.map(clubs => clubs.club_name);
        res.json(clubNames)
    }
    catch (err) {
        console.log(err.message);
    }
})

// clubRoutes.post("/", async (req, res) => {
//     try {
//         const { role, email, firebase_uid, class_year } = req.body;
//         const newUser = await pool.query(
//             "INSERT INTO users ( role, email, firebase_uid, class_year ) VALUES ($1, $2, $3, $4) RETURNING *",
//             [role, email, firebase_uid, class_year]  
//         );
//         res.json(newUser.rows[0]);
//     }
//     catch (err) {
//         console.log(err);
//     }
// })

clubRoutes.post("/", async (req, res) => {
    try {
        const { club_name, club_type, club_size, university, uni_abbr } = req.body;

        // Check if the club already exists
        const existingClub = await pool.query(
            "SELECT * FROM clubs WHERE club_name = $1 AND university = $2",
            [club_name, university]
        );

        if (existingClub.rows.length > 0) {
            res.json(existingClub.rows[0]);
        } else {
            const newClub = await pool.query(
                "INSERT INTO clubs (club_name, club_type, club_size, university, uni_abbr) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [club_name, club_type, club_size, university, uni_abbr]
            );
            res.json(newClub.rows[0]);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Server error");
    }
});

clubRoutes.get("/:club_id", async (req, res) => {
    try {
        const { club_id } = req.params;
        const club = await pool.query(
            "SELECT * FROM clubs WHERE club_id = ($1)",
            [club_id]
        );
        res.json(club.rows)
    }
    catch (err) {
        console.log(err);
    }
})

clubRoutes.get('/universities/:university/clubs', async (req, res) => {
    const { university } = req.params;
    const { clubType, clubSize } = req.query;
    
    try {
      let query = 'SELECT club_name FROM clubs WHERE university = $1';
      const params = [university];
  
      if (clubType) {
        query += ' AND club_type = $2';
        params.push(clubType);
      }
  
      if (clubSize) {
        query += ' AND club_size = $3';
        params.push(clubSize);
      }
  
      const result = await pool.query(query, params);
      res.json(result.rows.map(club => club.club_name));
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

  clubRoutes.patch('/:club_id', async (req, res) => {
    try {
        const { club_id } = req.params;
        const { club_size, club_type, meeting_days, photos } = req.body;

        let query;
        let values;

        if (photos !== null && photos !== undefined) {
            query = "UPDATE clubs SET club_type = $1, club_size = $2, meeting_days = $3, photos = $4 WHERE club_id = $5 RETURNING *";
            values = [club_type, club_size, meeting_days, photos, club_id];
        } else {
            query = "UPDATE clubs SET club_type = $1, club_size = $2, meeting_days = $3 WHERE club_id = $4 RETURNING *";
            values = [club_type, club_size, meeting_days, club_id];
        }

        const updatedClub = await pool.query(query, values);
    
        if (updatedClub.rows.length === 0) {
            return res.status(404).send("Club not found");
        }
    
        res.json(updatedClub.rows[0]);
    } catch (err) {
        console.error("Error updating club:", err.message);
        res.status(500).send("Failed to update club");
    }
});

  
  


module.exports = clubRoutes;