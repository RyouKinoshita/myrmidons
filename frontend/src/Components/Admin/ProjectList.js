import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MDBDataTable } from "mdbreact";

import MetaData from "../Layout/Metadata";
import Loader from "../Layout/Loader";
import Sidebar from "./SideBar";
import { getToken } from "../../utils/helpers";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  let navigate = useNavigate();
  const getAdminProjects = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:4001/api/v1/admin/portfolio`,
        config
      );
      console.log(data);
      setProjects(data.portfolios);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  useEffect(() => {
    getAdminProjects();
    if (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }

    if (deleteError) {
      toast.error(deleteError, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }

    if (isDeleted) {
      toast.success("Project deleted successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate("/admin/portfolio");
    }
  }, [error, deleteError, isDeleted]);
  const deleteProject = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.delete(
        `http://localhost:4001/api/v1/admin/portfolio/${id}`,
        config
      );

      setIsDeleted(data.success);
      setLoading(false);
    } catch (error) {
      setDeleteError(error.response.data.message);
    }
  };

  const projectsList = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Location",
          field: "location",
          sort: "asc",
        },
        {
          label: "Date",
          field: "date",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    projects.forEach((project) => {
      // Format the date to display only the date part
      const parsedDate = new Date(project.date);
      const year = parsedDate.getFullYear();
      const month = parsedDate.getMonth() + 1; // Month is zero-indexed, so add 1
      const day = parsedDate.getDate();
      const formattedDate = `${year}-${month < 10 ? "0" : ""}${month}-${
        day < 10 ? "0" : ""
      }${day}`;

      data.rows.push({
        id: project._id,
        name: project.name,
        location: project.location,
        date: formattedDate,
        actions: (
          <Fragment>
            <Link
              to={`/admin/portfolio/${project._id}`}
              className="btn btn-primary py-1 px-2"
            >
              <i className="fa fa-pencil" title="Edit Project"></i>
            </Link>
            <button
              className="btn btn-danger py-1 px-2 ml-2"
              title="Delete Project"
              onClick={() => deleteServiceHandler(project._id)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </Fragment>
        ),
      });
    });

    return data;
  };

  const deleteServiceHandler = (id) => {
    deleteProject(id);
  };

  return (
    <Fragment>
      <MetaData title={"All Projects"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <h1
              className="my-5"
              style={{ color: "white", fontWeight: "bold", marginLeft: "15px" }}
            >
              All Projects
            </h1>

            {loading ? (
              <Loader />
            ) : (
              <MDBDataTable
                data={projectsList()}
                className="px-3"
                bordered
                striped
                hover
                style={{ color: "white", fontWeight: "bold" }}
              />
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};
export default ProjectList;
