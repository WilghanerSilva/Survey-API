-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjetiveQuestion" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "item_A" TEXT,
    "item_A_answers" INTEGER,
    "item_B" TEXT,
    "item_B_answers" INTEGER,
    "item_C" TEXT,
    "item_C_answers" INTEGER,
    "item_D" TEXT,
    "item_D_answers" INTEGER,
    "item_E" TEXT,
    "item_E_answers" INTEGER,

    CONSTRAINT "ObjetiveQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjetiveQuestion" (
    "id" TEXT NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "surveyId" TEXT,

    CONSTRAINT "SubjetiveQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjetiveQuestionAwnser" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "awnser" TEXT NOT NULL,

    CONSTRAINT "SubjetiveQuestionAwnser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjetiveQuestion" ADD CONSTRAINT "ObjetiveQuestion_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjetiveQuestion" ADD CONSTRAINT "SubjetiveQuestion_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjetiveQuestionAwnser" ADD CONSTRAINT "SubjetiveQuestionAwnser_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "SubjetiveQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
