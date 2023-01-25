/*
  Warnings:

  - You are about to drop the column `item_A_answers` on the `ObjetiveQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `item_B_answers` on the `ObjetiveQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `item_C_answers` on the `ObjetiveQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `item_D_answers` on the `ObjetiveQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `item_E_answers` on the `ObjetiveQuestion` table. All the data in the column will be lost.
  - You are about to drop the `SubjetiveQuestionAwnser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubjetiveQuestionAwnser" DROP CONSTRAINT "SubjetiveQuestionAwnser_questionId_fkey";

-- AlterTable
ALTER TABLE "ObjetiveQuestion" DROP COLUMN "item_A_answers",
DROP COLUMN "item_B_answers",
DROP COLUMN "item_C_answers",
DROP COLUMN "item_D_answers",
DROP COLUMN "item_E_answers";

-- DropTable
DROP TABLE "SubjetiveQuestionAwnser";
