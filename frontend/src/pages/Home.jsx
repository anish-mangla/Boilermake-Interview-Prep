import React, { useState, useEffect } from "react";

const Home = () => {
    const [data, setData] = useState([]);
    const [newMember, setNewMember] = useState("");

    // Fetch members from the Flask backend
    const fetchMembers = () => {
        fetch("http://127.0.0.1:5000/members")
            .then(res => res.json())
            .then(data => {
                setData(data.members || []);
                console.log("Fetched data:", data);
            })
            .catch(err => console.error("Error fetching members:", err));
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    // Add a new member to the database
    const addMember = () => {
        if (!newMember.trim()) return alert("Please enter a member name.");

        fetch("http://127.0.0.1:5000/add_member", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"  // Ensure the header is set to JSON
            },
            body: JSON.stringify({ name: newMember })  // Send data as JSON
        })
        .then(res => res.json())
        .then(() => {
            setNewMember("");  // Clear input
            fetchMembers();    // Refresh members
        })
        .catch(err => console.error("Error adding member:", err));
    };

    return (
        <div>
            <h1>Member List</h1>

            {/* Input and Add Button */}
            <input
                type="text"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                placeholder="Enter member name"
            />
            <button onClick={addMember}>Add Member</button>

            {/* Display Members */}
            {data.length === 0 ? (
                <p>Loading or no members found...</p>
            ) : (
                data.map((member, i) => (
                    <p key={i}>{member}</p>
                ))
            )}
        </div>
    );
};

export default Home;
