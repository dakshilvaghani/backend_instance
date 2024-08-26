import Data from "../models/DataSchema.js";

export const addData = async (req, res) => {
  const { title, description, type } = req.body;

  // Check if required fields are provided
  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required",
    });
  }

  try {
    // Create a new Data object
    const newData = new Data({
      title,
      description,
      type,
    });

    // Save the data to the database
    const savedData = await newData.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: "Data successfully added",
      data: savedData,
    });
  } catch (err) {
    // Handle errors during saving
    res.status(500).json({
      success: false,
      message: "Failed to add data",
    });
  }
};

export const changeData = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedData = await Data.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedData,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

export const deleteData = async (req, res) => {
  const id = req.params.id;
  try {
    await Data.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

export const getData = async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  try {
    const data = await Data.findById(id);
    res.status(200).json({
      success: true,
      message: "Successfully fetched",
      data: data,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "No User Found" });
  }
};

export const getAllData = async (req, res) => {
  try {
    const datas = await Data.find({});
    res.status(200).json({
      success: true,
      message: "Successfully fetched",
      data: datas,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not Found" });
  }
};

export const filterData = async (req, res) => {
  const { title, timezone } = req.query;

  consol.log(title);

  try {
    // Build the query object
    let query = {};

    // If title is provided, add it to the query
    if (title) {
      query.title = { $regex: title, $options: "i" }; // Case-insensitive search
    }

    // If timezone is provided, filter by createdAt timestamp based on the timezone
    if (timezone) {
      const timezoneOffset = parseInt(timezone, 10); // Assuming timezone is provided as an offset in hours

      // Calculate the time range based on the provided timezone offset
      const now = new Date();
      const startOfDay = new Date(now.setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setUTCHours(23, 59, 59, 999));

      const start = new Date(
        startOfDay.getTime() + timezoneOffset * 60 * 60 * 1000
      );
      const end = new Date(
        endOfDay.getTime() + timezoneOffset * 60 * 60 * 1000
      );

      query.createdAt = { $gte: start, $lte: end };
    }

    // Fetch data based on the query
    const filteredData = await Data.find(query);

    // Return the filtered data
    res.status(200).json({
      success: true,
      message: "Filtered data successfully fetched",
      data: filteredData,
    });
  } catch (err) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Failed to fetch filtered data",
    });
  }
};
