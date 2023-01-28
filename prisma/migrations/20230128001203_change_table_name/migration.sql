/*
  Warnings:

  - You are about to drop the `ObjetiveQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjetiveQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ObjetiveQuestion" DROP CONSTRAINT "ObjetiveQuestion_surveyId_fkey";

-- DropForeignKey
ALTER TABLE "SubjetiveQuestion" DROP CONSTRAINT "SubjetiveQuestion_surveyId_fkey";

-- DropTable
DROP TABLE "ObjetiveQuestion";

-- DropTable
DROP TABLE "SubjetiveQuestion";

-- CreateTable
CREATE TABLE "ClosedQuestion" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "item_A" TEXT,
    "item_B" TEXT,
    "item_C" TEXT,
    "item_D" TEXT,
    "item_E" TEXT,

    CONSTRAINT "ClosedQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenQuestion" (
    "id" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "surveyId" TEXT,

    CONSTRAINT "OpenQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClosedQuestion" ADD CONSTRAINT "ClosedQuestion_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenQuestion" ADD CONSTRAINT "OpenQuestion_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE SET NULL ON UPDATE CASCADE;
