import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Upload, DatePicker, Select, Space, message } from "antd";
import { UploadOutlined,MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { CreateEod, EditEodById, GetEodById, GetProjects } from "../../../../services";

const TrainerEod = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState(dayjs().format("DD-MM-YYYY"));
  const [department, setDepartment] = useState(null);
  const [allProjectsData, setAllProjectsData] = useState({});
  const [listEodData, setListEodData] = useState([]);
  const [fields, setFields] = useState({});
  const [form] = Form.useForm();

  
const [isEditing, setIsEditing] = useState({
  description: false,
  uploadFile: false,
  links: false,
  projectName: false,
});

const handleEdit = (field) => {
  setIsEditing((prev) => ({ ...prev, [field]: true }));
};

const handleChange = (field, value) => {
  setFields((prev) => ({ ...prev, [field]: value }));
};

  const todayDate = dayjs().format("DD-MM-YYYY");

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);


  const filteredEods = listEodData.filter((eod) => dayjs( eod.date).format("DD-MM-YYYY") === filterDate);

  const handleDepartmentChange = (value) => {
    setDepartment(value);
  }

  const handleCreateEodSubmit = async(values) => {
    try {
      const formData = new FormData();
    formData.append("project", values.project);
    formData.append("department", values.department);
    formData.append("description", values.description);

    values.uploadFile?.forEach((file) => {
      formData.append("uploadFile", file.originFileObj);
    });


    values.links?.forEach((linkObj) => {
      formData.append("links[]", linkObj.link);
    });
      const response = await CreateEod(formData);
      console.log("reponse", response);
      if(response.data.status){
        message.success("Eod created successfully");
        form.resetFields();
        setIsModalOpen(false);
        fetchEodById();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || "Failed to create eod");
      console.error("Error in create eod",error);
    }
  }


  //fetch all projects
const fetchAllProjects = async() => {
  try {
    const response = await GetProjects();
    console.log("fetch all project",response);
    if(response.data.status){
      // setAllProjectsData(response.data.data)

      const groupedProjects = response.data.data.reduce((acc, project)=>{
      const department = project.department;
  if(!acc[department]){
    acc[department] = []
  }
  acc[department].push(project.projectName);
  return acc;

      },{});
      setAllProjectsData(groupedProjects);
    }
  } catch (error) {
    message.error(error?.response?.data?.message || "Failed to list all projects");
    console.error("error in fetch all projects", error);
  }
};

//fetch eod by id

const fetchEodById = async () => {
  try {
    const response = await GetEodById();
    if(response.data.status){
      setListEodData(response.data.data);
    }
  } catch (error) {
    message.error(error?.response?.data?.message || "Failed to list eod")
  }
}

useEffect(()=>{
fetchAllProjects();
fetchEodById();
},[])


//Edit eod by id

const handleEditEodById = async () => {
  try {
    const response = await EditEodById(fields, fields._id);
    if(response.data.status){
      message.success("Eod updated successfully")
    }
  } catch (error) {
    message.error(error?.response?.data?.message || "Failed to updated eod");
    console.error("err in edit eod",error)
  }
}


  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
      <button
       
        className="mb-6 bg-orange-500 text-white  px-3 py-1 rounded-md"
        onClick={showModal}
      >
        Add EOD Report
      </button>

      <div className="">
        <DatePicker
          className="w-full"
          placeholder="Filter by date"
          format={"DD-MM-YYYY"}
          onChange={(date, dateString) => setFilterDate(dateString || todayDate)}
        />
      </div>
      </div>

      {filteredEods.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">EOD Reports</h2>
       
          {filteredEods.map((eod, index) => (
            <div
              key={index}
              className="p-6 mb-6 border-l-4  border-orange-500 shadow-md rounded-lg bg-white"
            >
                <div className="flex justify-center items-center">
              <h3 className="text-2xl font-semibold   mb-4">
                {eod.department}
              </h3>
           
              </div>
             <div className="flex  justify-between items-start">
            <div className="">
              
             <p className="text-lg font-semibold">
  Project: <span className="text-md font-normal ">{eod.project}</span>
  <p className="text-lg font-semibold ">
              Name: <span className="text-md font-normal">{eod?.userName?.fullName}</span> 
              </p>
             
</p>
{eod.link && ( eod.link.map((link,i)=>(
  <>

                <p key={i} className="text-lg font-semibold">
                  Link:{" "}
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-500"
                  >
                    {link}
                  </a>
                </p>
                </>
))
              )}
</div>


              <p className="text-xl font-semibold mb-2">
            Date: <span className="text-lg font-normal"> {dayjs(eod.date).format("DD-MM-YYYY")}</span>
              </p>
              </div>
            
             <div className=" mt-12">
                 <p className="text-lg font-semibold flex flex-col  ">
            
            Description: <span className="text-md font-normal"> {eod.description}</span>
          </p>
          </div>
             

          <div className="mb-4">
  <div className="grid grid-cols-2 gap-4 mt-2">
    {eod.uploadFile.map((file, index) => (
      <div key={index} className="w-full h-[500px] overflow-hidden border rounded-md">
        {console.log("uploading....",file)}
        <img
          src={file}
          alt={file}
          className="object-cover w-full h-full"
        />
      </div>
    ))}
  </div>
</div>


             
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No EOD reports found for the selected date.</p>
      )}

{/* <div>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">EOD Reports</h2>
          {listEodData.map((eod, index) => (
            <div
              key={index}
              className="p-6 mb-6 border-l-4  border-orange-500 shadow-md rounded-lg bg-white"
            >
                <div className="flex justify-center items-center">
              <h3 className="text-2xl font-semibold   mb-4">
                {eod.department}
              </h3>
           
              </div>
             <div className="flex  justify-between items-start">
            <div className="">
             <p className="text-lg font-semibold">
  Project: <span className="text-md font-normal ">{eod.project}</span>
  <p className="text-lg font-semibold ">
              Name: <span className="text-md font-normal">{eod?.userName?.fullName}</span> 
              </p>
             
</p>
{eod.link && ( eod.link.map((link,i)=>(
  <>

                <p key={i} className="text-lg font-semibold">
                  Link:{" "}
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-500"
                  >
                    {link}
                  </a>
                </p>
                </>
))
              )}
</div>


              <p className="text-xl font-semibold mb-2">
            Date: <span className="text-lg font-normal"> {dayjs(eod.date).format("DD-MM-YYYY")}</span>
              </p>
              </div>
            
             <div className=" mt-12">
                 <p className="text-lg font-semibold flex flex-col  ">
            
            Description: <span className="text-md font-normal"> {eod.description}</span>
          </p>
          </div>
             

          <div className="mb-4">
  <div className="grid grid-cols-2 gap-4 mt-2">
    {eod.uploadFile.map((file, index) => (
      <div key={index} className="w-full h-[500px] overflow-hidden border rounded-md">
        {console.log("uploading....",file)}
        <img
          src={file}
          alt={file}
          className="object-cover w-full h-full"
        />
      </div>
    ))}
  </div>
</div>


             
            </div>
          ))}
        </div> */}

<Modal
      visible={isModalOpen}
      onCancel={handleCancel}
      centered
      title="Add EOD"
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateEodSubmit}
      >
        <Form.Item
          label="Department"
          name="department"
          rules={[{ required: true, message: "Please choose your department" }]}
        >
          <Select placeholder="Select your department" onChange={handleDepartmentChange}>
            <Select.Option value="DEV-Team">Dev Team</Select.Option>
            <Select.Option value="DM-Team">DM Team</Select.Option>
            <Select.Option value="Marketing">Marketing</Select.Option>
            <Select.Option value="Sales">Sales</Select.Option>
            <Select.Option value="Placement">Placement</Select.Option>
          </Select>
        </Form.Item>

    {/*   {(department === "DEV-Team" || department === "DM-Team") && ( */} 

    {department && allProjectsData[department] && (
          
          <Form.Item
            label="Project"
            name="project"
            rules={[{ required: true, message: "Please choose your project" }]}
          >
            <Select placeholder="Select your project">
            {allProjectsData[department].map((projectName, index) => (
                  <Select.Option key={index} value={projectName}>
                    {projectName}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea rows={4} placeholder="Write a brief description" />
        </Form.Item>

        <Form.Item
          label="File Upload"
          name="uploadFile"
          valuePropName="fileList"
          getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}
        >
          <Upload
            multiple
            listType="picture"
            beforeUpload={() => false} // Prevent automatic upload
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.List
          name="links"
          initialValue={[]}
          // rules={[
          //   {
          //     validator: async (_, links) => {
          //       if (!links || links.length < 1) {
          //         return Promise.reject(new Error("At least one link is required"));
          //       }
          //     },
          //   },
          // ]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, "link"]}
                    fieldKey={[fieldKey, "link"]}
                    rules={[{ required: true, message: "Please enter a link" }]}
                  >
                    <Input placeholder="Enter a link" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Add Link
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <button
            htmlType="submit"
            className="w-full bg-orange-500 py-1 rounded-md text-white hover:bg-orange-600"
          >
            Submit
          </button>
        </Form.Item>
      </Form>
    </Modal>
    </div>
  );
};

export default TrainerEod;

