import mongoose from "mongoose";

const labSchema = new mongoose.Schema({
    projects:{
        type: [
            {
                title:{
                    type: String,
                    required: true
                },
                subtitle:{
                    type: String,
                    required: true
                },
                bsl:{
                    type: String,
                    enum: ["BSL-1", "BSL-2", "BSL-3", "BSL-4"],
                    required: true
                },
                startDate:{
                    type: Date,
                    required: true
                },
                endDate:{
                    type: Date,
                    required: true
                },
                teamMembers:{
                    type:[String],
                    required: true
                },
                aim:{
                    type: String,
                    required: true
                },
                objectives:{
                    type: [String],
                    required: true
                },
                methodology:{
                    type: String,
                    required: true
                },
                equipment:{
                    type: [String],
                    required: true
                },
                results:{
                    type:[String],
                    required: true
                }
            }
        ]
    },
    assistants:{
        type: [
            {
                name:{
                    type: String,
                    required: true
                },
                email:{
                    type: String,
                    required: true
                },
                photoUrl:{
                    type: String,
                    required: true
                },
                designation:{
                    type: String,
                    enum: ["Dr", "Mr", "Ms", "Mrs", "Prof", "Assoc Prof", "Asst Prof"],
                    required: true
                },
                role:{
                    type: String,
                    required: true
                },
                department:{
                    type: String,
                    required: true
                },
                specialization:{
                    type: String,
                    required: true
                },
                experience:{
                    type: String,
                    required: true
                },
                qualification:{
                    type: [
                        {
                            degree:{
                                type: String,
                                required: true
                            },
                            institution:{
                                type: String,
                                required: true
                            },
                            year:{
                                type: Number,
                                required: true
                            }
                        }
                    ]
                }
            }
        ]
    },
    equipments:{
        type: [
            {
                name:{
                    type: String,
                    required: true
                },
                model:{
                    type: String,
                    required: true
                },
                photoUrl:{
                    type: String,
                    required: true
                },
                manufacturer:{
                    type: String,
                    required: true
                },
                year:{
                    type: Number,
                    required: true
                },
                specifications:{
                    type:[
                        {
                            specification:{
                                type: String,
                                required: true
                            }
                        }
                    ]
                }
            }
        ]
    },
})

const Lab = mongoose.model("Lab", labSchema);
export default Lab;