DROP TABLE IF EXISTS submission;

CREATE TABLE "submission" (
  "id" SERIAL PRIMARY KEY,
  "image_url" TEXT NOT NULL,
  "karma_total" INTEGER DEFAULT 0,
  "latitude" TEXT NOT NULL,
  "longitude" TEXT NOT NULL,
  "create_timestamp" TIMESTAMP DEFAULT NOW()
);