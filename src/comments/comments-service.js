const CommentsService = {
  getAllComments(db) {
    return db.select('*').from('comments');
  },

  getComment(db, id) {
    return db
      .select('*')
      .from('comments')
      .where({ id })
      .first();
  },

  createComment(db, comment) {
    return db
      .insert(comment)
      .into('comments')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },

  updateComment(db, id, updateFields) {
    return db('comments')
      .where({ id })
      .update(updateFields);
  },

  deleteComment(db, id) {
    return db('comments')
      .where({ id })
      .delete();
  },
};

module.exports = CommentsService;
