import React from 'react'
import './AddOperators.css'

export default function AddOperators() {

    const handleSubmit = (e) => {
        e.prevent.default()
        // onUpdate({ ...productData, name: productName, price });
        // onClose();
    };
    return (
        <>
            <div className="add-container">
                <div className="add-form">
                    <h2>Add Data Entry <span>Operator</span> </h2>
                    <form action="submit" className='register-operator-form'>
                        <div className="input">

                            <label>Name:</label>
                            <input
                                type="text"
                            // value={currentProduct.name}
                            // onChange={(e) => setCurrentProduct(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="input">
                            <label>CNIC:</label>

                            <input
                                type="text"
                            // value={currentProduct.description}
                            // onChange={(e) => setCurrentProduct(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>

                        <div className="input">
                            <label>Username:</label>

                            <input
                                type="text"
                            // value={currentProduct.description}
                            // onChange={(e) => setCurrentProduct(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>

                        <div className="input">
                            <label>Email:</label>

                            <input
                                type="text"
                            // value={currentProduct.description}
                            // onChange={(e) => setCurrentProduct(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="input">
                            <label>Password:</label>

                            <input
                                type="text"
                            // value={currentProduct.description}
                            // onChange={(e) => setCurrentProduct(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="input">
                            <label>Number:</label>

                            <input
                                type="text"
                            // value={currentProduct.description}
                            // onChange={(e) => setCurrentProduct(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="input">
                            <label>Address:</label>

                            <input
                                type="text"
                            // value={currentProduct.description}
                            // onChange={(e) => setCurrentProduct(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="input">
                            <label>Date Of Birth:</label>

                            <input
                                type="text"
                            // value={currentProduct.description}
                            // onChange={(e) => setCurrentProduct(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <button onClick={(e) => handleSubmit(e)}>Add Data Entry Operator</button>
                    </form>
                </div>
            </div>
        </>
    )
}
