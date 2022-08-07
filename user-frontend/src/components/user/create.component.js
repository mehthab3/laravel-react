import React, { useState,useEffect } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Select from "react-select";


export default function CreateUser() {
  const navigate = useNavigate();
  useEffect(()=>{
    fetchRoles() 
  },[])

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [validationError,setValidationError] = useState({})
  const [roles, setRoles] = useState([]);
  const [rolesData, setRolesData] = useState([]);

  const fetchRoles = async () => {
    await axios.get(`http://localhost:8000/api/roles`).then(({data})=>{
      setRolesData(data)
      console.log(data)
    })
  }
  const createUser = async (e) => {
    e.preventDefault();

    const formData = new FormData()

    formData.append('name', name)
    formData.append('email', email)
    formData.append('roles', roles)

    await axios.post(`http://localhost:8000/api/users/create`, formData).then(({data})=>{
      Swal.fire({
        icon:"success",
        text:data.message
      })
      navigate("/")
    }).catch(({response})=>{
      if(response.status===422){
        setValidationError(response.data.errors)
      }else{
        Swal.fire({
          text:response.data.message,
          icon:"error"
        })
      }
    })
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Create User</h4>
              <hr />
              <div className="form-wrapper">
                {
                  Object.keys(validationError).length > 0 && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-danger">
                          <ul className="mb-0">
                            {
                              Object.entries(validationError).map(([key, value])=>(
                                <li key={key}>{value}</li>   
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }
                <Form onSubmit={createUser}>
                  <Row> 
                      <Col>
                        <Form.Group controlId="Name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" value={name} onChange={(event)=>{
                              setName(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>  
                  </Row>
                  <Row className="my-3">
                      <Col>
                        <Form.Group controlId="Email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" value={email} onChange={(event)=>{
                              setEmail(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>
                  </Row>
                  <Row className="my-3">
                      <Col>
                      <Form>
                      <Select placeholder="Select Roles"
                        onChange={(e)=>setRoles(e.value)}
                        options={rolesData.filter(obj => obj.role)}
                        value={rolesData.filter(obj => obj.id)}
                        isMulti
                      />
                      </Form>
                      </Col>
                  </Row>
                  <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                    Save
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}