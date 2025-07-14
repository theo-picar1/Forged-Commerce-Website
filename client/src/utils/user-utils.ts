import { User } from "../types/User"

// Find users starting with passed in prefix for the searchbar autocomplete modal
export function findUsersWithPrefix(prefix: string, users: User[]): User[] {
    let matched: User[] = []

    console.log(users)

    if (prefix !== "" && prefix.length > 0) {
        users.forEach(user => {
            const fullName = user.firstName + " " + user.lastName
            
            if (fullName.toLowerCase().startsWith(prefix.toLowerCase())) {
                console.log("found")
                matched.push(user)
            }
        })
    }

    return matched
}