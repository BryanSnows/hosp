
import { UserTransaction } from "./transactions/user.transaction";
import { AccessControlTransaction } from "./transactions/access-control.transaction";


let Permission = {
    User: UserTransaction,
    AccessControl: AccessControlTransaction
}

export default Permission;