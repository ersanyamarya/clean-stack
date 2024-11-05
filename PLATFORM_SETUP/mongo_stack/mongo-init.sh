set -e

mongosh -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD <<EOF
use admin
db = db.getSiblingDB('clean-stack')
db.createUser({
  user: 'clean-stack',
  pwd:  '$MONGO_USER_PASSWORD',
  roles: [{
    role: 'readWrite',
    db: 'clean-stack'
  }]
})


EOF
