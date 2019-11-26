BEGIN;

TRUNCATE "submission";


INSERT INTO "submission" ("id", "image_url", "karma_total", "latitude", "longitude", "create_timestamp")
VALUES ( 1,
  'https://cdn.pixabay.com/photo/2019/11/20/17/42/vancouver-4640671_960_720.jpg', 10, 
'29.651979', '-82.325020', now() - INTERVAL '1 DAYS'),
( 2, 
  'https://cdn.pixabay.com/photo/2019/11/20/06/15/macro-4639241__340.jpg', 13, 
'36.102371', '-115.174553', now()),
( 3, 
  'https://cdn.pixabay.com/photo/2019/06/15/16/37/tunnel-4276025__340.jpg', 10, 
'36.102371', '-115.174553', now() - INTERVAL '3 DAYS'),
( 4, 
  'https://cdn.pixabay.com/photo/2019/11/05/00/53/cellular-4602489__340.jpg', 1, 
'36.102371', '-115.1745530', now() - INTERVAL '3 DAYS'),
( 5, 
  'https://cdn.pixabay.com/photo/2019/10/29/14/46/landscape-4587079__340.jpg', 100, 
'39.739235', '-104.990250', now() - INTERVAL '4 DAYS'),
( 6, 
  'https://lh5.googleusercontent.com/p/AF1QipPByKR9mLR-6_vebNjxSWfJu9qcjdhkBfV-Yrq6=w408-h267-k-no', 2, 
'28.005110', '-81.956520', now() - INTERVAL '4 DAYS');

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('submission_id_seq', (SELECT MAX(id) from "submission"));

COMMIT;