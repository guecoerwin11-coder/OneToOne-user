const user = [
    {id: 1, name: "jaslee", password: "jas123", isOnline: false},
    {id: 2, name: "maki", password: "maki123", isOnline: false},
    {id: 3, name: "kulot", password: "kulot123", isOnline: false}
]

//get users all except one
const getOneUser = (id) => {
    //filter means hanapin if yung id ayy hidni nag match means wala
    return users.filter(u => u.id !== id)
        .map(u => ({
            id: u.id,
            name: u.name,
            isOnline: u.isOnline
        }))
}

//update user status one
const updateUserStatus = (id, status) => {
    const user = users.find(u => u.id === id)

    if(user) user.isOnline = status
}


module.exports = {users, getOneUser, updateUserStatus}