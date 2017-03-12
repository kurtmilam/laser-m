/**
 * Created by Kurt on 2017-03-09.
 */
// src/components/User/UserModel.js

// import libraries
import m from 'mithril'
import Stream from 'mithril/stream'

const User = { list: Stream( [] )
             , loadList: () =>
                 m.request( { method: "GET"
                            , url: "http://rem-rest-api.herokuapp.com/api/users"
                            , withCredentials: true
                            }
                          )
                 .then( result => User.list( result.data ) )

             , curr: Stream()

             , load: id =>
                 m.request( { method: "GET"
                            , url: "http://rem-rest-api.herokuapp.com/api/users/:id"
                            , data: { id }
                            , withCredentials: true
                            }
                          )
                 .then( result => User.curr( result ) )

             , save: () =>
                 m.request( { method: "PUT"
                            , url: "http://rem-rest-api.herokuapp.com/api/users/:id"
                            , data: User.curr()
                            , withCredentials: true
                            }
                          )
             }

module.exports = User
