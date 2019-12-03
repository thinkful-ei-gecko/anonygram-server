const path = require('path');
const express = require('express');
const xss = require('xss');
const CommentsService = require('./comments-service');
const commentsRouter = express.Router();
const jsonParser = express.json();

const sanitizedComment = (comment) => ({
  id: comment.id,
  text: xss(comment.text),
  comment_timestamp: comment.comment_timestamp,
  submission_id: comment.submission_id,
  user_id: comment.user_id,
});

/*****************************************************************
  /comments
******************************************************************/
commentsRouter
  .route('/')
  .get((req, res, next) => {
    CommentsService.getAllComments(req.app.get('db'))
      .then((comments) => {
        return res.json(comments.map(sanitizedComment));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { text, submission_id, user_id, comment_timestamp } = req.body;
    const newComment = { text, submission_id, user_id };

    for (const [key, value] of Object.entries(newComment)) {
      if (!value) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    newComment.comment_timestamp = comment_timestamp;

    CommentsService.createComment(req.app.get('db'), newComment)
      .then((comment) => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${comment.id}`))
          .json(sanitizedComment(comment));
      })
      .catch(next);
  });

/*****************************************************************
  /comments/:comment_id
******************************************************************/
commentsRouter
  .route('/:comment_id')
  .all((req, res, next) => {
    CommentsService.getComment(req.app.get('db'), req.params.comment_id).then(
      (comment) => {
        if (!comment) {
          return res.status(404).json({
            error: { message: 'Comment does not exist' },
          });
        }
        res.comment = comment; // save the comment for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      }
    );
  })
  .get((req, res) => {
    return res.json(sanitizedComment(res.comment));
  })
  .delete((req, res, next) => {
    CommentsService.deleteComment(req.app.get('db'), req.params.comment_id)
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { text, comment_timestamp } = req.body;
    const updateFields = { text, comment_timestamp };

    const numberOfValues = Object.values(updateFields).filter((val) => !!val).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message:
            'Request body must contain either text or comment_timestamp',
        },
      });
    }

    CommentsService.updatecomment(
      req.app.get('db'),
      req.params.comment_id,
      updateFields
    )
      .then(() => {
        return res.status(204).end();
      })
      .catch(next);
  });

module.exports = commentsRouter;
