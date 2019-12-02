BEGIN;

TRUNCATE "submission";
TRUNCATE "users";


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
'28.005110', '-81.956520', now() - INTERVAL '4 DAYS'),
( 7, 
  'https://geo3.ggpht.com/cbk?panoid=_d8cM2qa5BtTlDtY8sW3Jg&output=thumbnail&cb_client=search.gws-prod.gps&thumb=2&w=408&h=240&yaw=314.82962&pitch=0&thumbfov=100', 2, 
'30.082990', '-95.445560', now() - INTERVAL '3 DAYS'),
( 8, 
  'https://lh5.googleusercontent.com/proxy/mqqIl2E310l3OBhuvLjR4aFv72YOflfghY3v3XB95KypAZnx4rF7LxPkI9CFw4g5PzLryAgNXPDd-zcZ1TGY1yw6s1jDDcfjdg2WMSjDIq_kF1pVu-LX95M36E_eCHEJJRE1GE7-FDQszycNP46KWbX7qsg=w408-h272-k-no', 23, 
'30.063540', '-95.432850', now() - INTERVAL '4 DAYS'),
( 9, 
  'https://lh5.googleusercontent.com/p/AF1QipOf1-8TZinknbAPPTIl1klo-1EBZ4f6MvhcAI21=w408-h544-k-no', 25, 
'30.063210', '-95.441330', now() - INTERVAL '4 DAYS'),
( 10, 
  'https://lh5.googleusercontent.com/p/AF1QipPrhZG7U-e51i6inmh1xideoqPv8R5mhnDVA8uz=w408-h306-k-no', 50, 
'30.074340', '-95.418730', now() - INTERVAL '4 DAYS'),
( 11, 
  'https://lh5.googleusercontent.com/p/AF1QipNWFChvDVKXhw0hYun4iMBEVRxTXlayRZTR0fOr=w408-h306-k-no', 3, 
'30.092050', '-95.405420', now() - INTERVAL '3 DAYS'),
( 12, 
  'https://lh5.googleusercontent.com/p/AF1QipPAv-vdOrYRo3l8-z2jPF1bO0oNH2P42WBq0MbU=w408-h544-k-no', 33, 
'30.113540', '-95.453750', now() - INTERVAL '3 DAYS'),
( 13, 
  'https://lh5.googleusercontent.com/p/AF1QipPai-X6IVR0wk_W1jv2LTg9IouI3AmDC5ovhDM4=w408-h272-k-no', 1, 
'30.121900', '-95.447260', now() - INTERVAL '4 DAYS');

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('submission_id_seq', (SELECT MAX(id) from "submission"));

INSERT INTO users ("username", "password")
 VALUES (
   'admin', 
   -- password
   '$2a$12$LYtNBy8xFQfDwU1CuyrCrO9UIOlxlosDiSZDnsCtvAyRLolHwaChe'
   );

COMMIT;