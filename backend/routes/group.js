const express = require('express');
const router = express.Router();
const {
    createGroup,
    getGroups,
    updateGroup,
    deleteGroup,
    addMember,
    removeMember
} = require('../controllers/groupController');
const { protect } = require('../middleware/authMiddleware');

// CRUD Routes
router.route('/')
    .post(protect, createGroup)
    .get(protect, getGroups);

router.route('/:id')
    .put(protect, updateGroup)
    .delete(protect, deleteGroup);

// Member Management
router.route('/:id/members')
    .post(protect, addMember)      // POST /api/groups/:id/members
    .delete(protect, removeMember); // DELETE /api/groups/:id/members

module.exports = router;
