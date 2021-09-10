const NoteSection = {
  notes: async ({ id }, args, { PersonalNoteModel }) => {
    const notes = await PersonalNoteModel.find({ sectionId: id });
    return notes.map((note) => ({
      id: note._id,
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      sectionId: note.sectionId,
    }));
  },
};

module.exports = NoteSection;
