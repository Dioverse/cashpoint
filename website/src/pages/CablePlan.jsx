import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Topnav from "../components/Topnav";
import NavLink from "../components/NavLink";

export default function CablePlan() {
  return (
    <>
        <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                {/* Menu */}
                    <Navbar />
                {/* / Menu */}

                {/* Layout container */}
                <div className="layout-page">
                    {/* Navbar */}

                    <Topnav />

                    {/* / Navbar */}

                    {/* Content wrapper */}
                    <div className="content-wrapper">
                        {/* Content */}

                        <div className="container-xxl flex-grow-1 container-p-y">

                            <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Home /Pricing</span> / Cable</h4>
                            
                            <div className="row">
                                <div className="col-lg-12 mb-4 order-0">
                                    <NavLink />
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="mb-0">Filter Pricing Plans</h5>

                                            <div className="card-header-actions">
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <form action="">
                                                            <select className="form-select">
                                                                <option value="">All Plans</option>
                                                                <option value="1">GOTV</option>
                                                                <option value="2">DSTV</option>
                                                                <option value="3">StarTimes</option>
                                                            </select>
                                                        </form>
                                                    </div>
                                                    <div className="col-md-8">
                                                        {/* Float this to the right */}
                                                        <div className="float-end">
                                                            <button
                                                            type="button"
                                                            class="btn btn-primary"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#basicModal"
                                                            >
                                                            Add Plan
                                                            </button>
                                                        </div> 
                                                        <div className="modal fade" id="basicModal" tabindex="-1" aria-hidden="true">
                                                            <div className="modal-dialog" role="document">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <h5 className="modal-title" id="exampleModalLabel1">Add Plan</h5>
                                                                        <button
                                                                        type="button"
                                                                        className="btn-close"
                                                                        data-bs-dismiss="modal"
                                                                        aria-label="Close"
                                                                        ></button>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        <div className="row">
                                                                        <div className="col mb-3">
                                                                            <label for="nameBasic" className="form-label">Cable TVs</label>
                                                                            <select id="statusBasic" className="form-select">
                                                                                <option value="1">GOTV</option>
                                                                                <option value="2">DSTV</option>
                                                                                <option value="3">Startimes</option>
                                                                            </select>
                                                                        </div>
                                                                        </div>
                                                                         <div className="row g-2">
                                                                            <div className="col mb-0">
                                                                                <label for="planName" className="form-label">Plan Name</label>
                                                                                <input type="text" id="planName" className="form-control" />
                                                                            </div>
                                                                            <div className="col mb-0">
                                                                                <label for="planCode" className="form-label">Plan Code</label>
                                                                                <input type="text" id="planCode" className="form-control" />
                                                                            </div>
                                                                        </div>
                                                                        <div className="row g-2 mt-2">
                                                                            <div className="col mb-0">
                                                                                <label for="buyPrice" className="form-label">Buy Price</label>
                                                                                <input type="number" id="buyPrice" className="form-control" min={1} max={5} />
                                                                            </div>
                                                                            <div className="col mb-0">
                                                                                <label for="sellingPrice" className="form-label">Selling Price</label>
                                                                                <input type="number" id="sellingPrice" className="form-control" min={1} max={5} />
                                                                            </div>
                                                                            <div className="col mb-0">
                                                                                <label for="dobBasic" className="form-label">Status</label>
                                                                                <select id="statusBasic" className="form-select">
                                                                                    <option value="active">Active</option>
                                                                                    <option value="inactive">Inactive</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="modal-footer">
                                                                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                                                                        Close
                                                                        </button>
                                                                        <button type="button" className="btn btn-primary">Save changes</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </div>

                                                                                       
                                        </div>
                                        <div className="d-flex align-items-end row">
                                            <div className="table-responsive text-nowrap">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                        <th width="50">#</th>
                                                        <th>Cable</th>
                                                        <th>Code</th>
                                                        <th>Buy Price</th>
                                                        <th>Selling Price</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="table-border-bottom-0">
                                                        <tr>
                                                            <td>1</td>
                                                            <td>
                                                                GOTV, Gotv-Lite
                                                            </td>
                                                            <td>
                                                                123
                                                            </td>
                                                            <td>#3,000</td>
                                                            <td>#3,300</td>
                                                            <td><span class="badge bg-label-primary me-1">Active</span></td>
                                                            <td>
                                                                <div class="dropdown">
                                                                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                                    <i class="bx bx-dots-vertical-rounded"></i>
                                                                </button>
                                                                <div class="dropdown-menu">
                                                                    <a class="dropdown-item" href="javascript:void(0);"
                                                                    ><i class="bx bx-edit-alt me-1"></i> Edit</a
                                                                    >
                                                                    <a class="dropdown-item" href="javascript:void(0);"
                                                                    ><i class="bx bx-trash me-1"></i> Delete</a
                                                                    >
                                                                </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>2</td>
                                                            <td>
                                                                GOTV, Gotv-Smalie
                                                            </td>
                                                            <td>
                                                                128
                                                            </td>
                                                            <td>#4,000</td>
                                                            <td>#4,500</td>
                                                            <td><span class="badge bg-label-primary me-1">Active</span></td>
                                                            <td>
                                                                <div class="dropdown">
                                                                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                                    <i class="bx bx-dots-vertical-rounded"></i>
                                                                </button>
                                                                <div class="dropdown-menu">
                                                                    <a class="dropdown-item" href="javascript:void(0);"
                                                                    ><i class="bx bx-edit-alt me-1"></i> Edit</a
                                                                    >
                                                                    <a class="dropdown-item" href="javascript:void(0);"
                                                                    ><i class="bx bx-trash me-1"></i> Delete</a
                                                                    >
                                                                </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* / Content */}

                        {/* Footer */}
                        <Footer/>
                        {/* / Footer */}

                        <div className="content-backdrop fade"></div>
                    </div>
                    {/* Content wrapper */}
                </div>
                {/* / Layout page */}
            </div>
        </div>
    </>
  );
}
