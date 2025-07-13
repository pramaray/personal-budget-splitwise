const Group = require('../models/group');

// Create Group
exports.createGroup = async (req, res) => {
    const { name, members } = req.body;
    if (!name || !members || !members.length) {
        return res.status(400).json({ message: "Name and members are required" });
    }
    try {
        const group = await Group.create({ name, members });
        res.status(201).json(group);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get All Groups
exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.find().populate('members', 'name email');
        res.status(200).json(groups);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Group (rename or update members)
exports.updateGroup = async (req, res) => {
    const { name, members } = req.body;

    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Update fields only if provided
        if (name) group.name = name;
        if (members) group.members = members;

        const updatedGroup = await group.save();
        res.status(200).json(updatedGroup);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete Group
exports.deleteGroup = async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json({ message: "Group deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add Member
exports.addMember = async (req, res) => {
    const { userId } = req.body;

    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        if (!userId) {
            return res.status(400).json({ message: "User ID required" });
        }

        // Avoid duplicates
        if (group.members.includes(userId)) {
            return res.status(400).json({ message: "User already in group" });
        }

        group.members.push(userId);
        const updatedGroup = await group.save();

        res.status(200).json(updatedGroup);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Remove Member
exports.removeMember = async (req, res) => {
    const { userId } = req.body;

    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        group.members = group.members.filter(
            member => member.toString() !== userId
        );

        const updatedGroup = await group.save();

        res.status(200).json(updatedGroup);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate("members", "name email");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};