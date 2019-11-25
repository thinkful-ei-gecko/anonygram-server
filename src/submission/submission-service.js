const SubmissionService = {
  getSubmissionsSorted: (db, sort = 'new') => {
    if (sort === 'new') {
      return db('submission')
        .select('*')
        .orderBy('create_timestamp', 'DESC')
    } else {
      return db('submission')
        .select('*')
        .orderBy('karma_total', 'DESC')
    }
      
  }
}

module.exports = SubmissionService