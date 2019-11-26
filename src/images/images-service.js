const ImagesService = {
  createSubmission(db, submission) {
    return db
      .insert(submission)
      .into('submission')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = ImagesService;
