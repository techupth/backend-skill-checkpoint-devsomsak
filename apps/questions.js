import { Router } from "express";
import { ObjectId } from "mongodb";
import { db } from "../utils/db.js";
import { validateData } from "./question.validation.js";

const questionRouter = Router();

questionRouter.get("/", async (req, res) => {
  try {
    const topic = req.query.keywords;
    const category = req.query.category;

    let limit = parseInt(req.query.limit) || 20;
    limit = Math.min(limit, 20);

    const query = {};
    if (topic) {
      query.topic = new RegExp(topic, "i");
    }
    if (category) {
      query.category = new RegExp(category, "i");
    }
    const collection = db.collection("questions");
    const projection = {
      topic: 1,
      description: 1,
      category: 1,
      released: 1,
      answer: 1,
      comment: 1,
    };
    const allQuestion = await collection
      .find(query)
      .limit(limit)
      .project(projection)
      .toArray();
    return res.json({ data: allQuestion });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRouter.get("/:questId", async (req, res) => {
  try {
    const collection = db.collection("questions");
    const questId = new ObjectId(req.params.questId);

    const questById = await collection.findOne({ _id: questId });

    return res.json({ data: questById });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRouter.post("/", validateData, async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const collection = db.collection("questions");

    const questionData = { ...req.body, created_at: new Date() };
    const newQuestionData = await collection.insertOne(questionData);
    return res.json({
      message: `Question Id ${newQuestionData.insertedId} has been created successfully`,
      data: questionData,
      status: 200,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});

questionRouter.put("/:questId", validateData, async (req, res) => {
  try {
    const collection = db.collection("questions");

    const newQuestionData = { ...req.body, modified_at: new Date() };

    const questionId = new ObjectId(req.params.questId);

    await collection.updateOne(
      {
        _id: questionId,
      },
      {
        $set: newQuestionData,
      }
    );
    return res.json({
      message: `Question record ${questionId} has been updated successfully`,
      data: newQuestionData,
      status: 200,
    });
  } catch (error) {
    return res.json({
      message: `${error}`,
    });
  }
});
// questionRouter.put("/:questId", async (req, res) => {
//   try {
//     const collection = db.collection("questions");
//     // นำข้อมูลที่ส่งมาใน Request Body ทั้งหมด Assign ใส่ลงไปใน Variable ที่ชื่อว่า `newProductData`
//     const newQuestionData = { ...req.body, modified_at: new Date() };

//     //Update ข้อมูลใน Database โดยใช้ `collection.updateOne(query)

//     const newQuestId = new ObjectId(req.params.questId);

//     await collection.updateOne(
//       {
//         _id: newQuestId,
//       },
//       {
//         $set: newQuestionData,
//       }
//     );
//     return res.json({
//       message: `Question record ${newQuestId} has been updated successfully`,
//     });
//   } catch (error) {
//     return res.json({
//       message: `${error}`,
//     });
//   }
// });

questionRouter.delete("/:questId", async (req, res) => {
  try {
    const collection = db.collection("questions");

    // Validate if the provided ID is a valid ObjectId
    const questId = new ObjectId(req.params.questId);

    // Perform delete operation
    const result = await collection.deleteOne({ _id: questId });

    if (result.deletedCount === 1) {
      return res.json({
        message: `Question record ${questId} has been deleted successfully`,
      });
    } else {
      return res.status(404).json({
        message: `Question record with ID ${questId} not found`,
      });
    }
  } catch (error) {
    console.error("Error during movie deletion:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

export default questionRouter;
