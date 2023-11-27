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

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  let navigate = useNavigate();
  const getAdminMember = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:4001/api/v1/admin/MemberList`,
        config
      );
      console.log(data.team);
      setMembers(data.team);
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  useEffect(() => {
    getAdminMember();

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
      toast.success("Member deleted successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate("/admin/MemberList");
    }
  }, [error, deleteError, isDeleted]);

  const deleteMember = async (id) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      };
      const { data } = await axios.delete(
        `http://localhost:4001/api/v1/admin/Memberlist/${id}`,
        config
      );
      console.log(data.success)
      setIsDeleted(data.success);
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 1000);
      setLoading(false);
      
    } catch (error) {
      setDeleteError(error.response.data.message);
    }
  };

  const membersList = () => {
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
          label: "Position",
          field: "position",
          sort: "asc",
        },
        {
          label: "Description",
          field: "description",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
        },
      ],
      rows: [],
    };

    members.forEach((members) => {
      data.rows.push({
        id: members._id,
        name: members.name,
        position: members.position,
        description: members.description,
        actions: (
          <Fragment>
            <div className="button-container">
              <Link
                to={`/admin/UpdateMember/${members._id}`}
                className="btn btn-primary py-1 px-2"
                title="Edit Member"
              >
                <i className="fa fa-pencil"></i>
              </Link>
              <button
                className="btn btn-danger py-1 px-2 ml-2"
                title="Delete Member"
                onClick={() => deleteMemberHandler(members._id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </div>
          </Fragment>
        ),
      });
    });

    return data;
  };

  const deleteMemberHandler = (id) => {
    console.log(id)
    deleteMember(id);
  };

  return (
    <Fragment>
      <MetaData title={"All Members"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">All Members</h1>

            {loading ? (
              <Loader />
            ) : (
              <MDBDataTable
                data={membersList()}
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

export default MemberList;
