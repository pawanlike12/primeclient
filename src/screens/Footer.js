import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  ImageBackground,
  AsyncStorage,
  Alert,ScrollView,WebView
} from 'react-native';
// import { StackActions, NavigationActions } from 'react-navigation';
import { withNavigation } from 'react-navigation';
import styles from '../assets/style/Stylesheet';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, StackActions, NavigationActions } from 'react-navigation';
import dashboard from './Dashbaord'
import {showSnackBar} from '@prince8verma/react-native-snackbar';
import Snackbar from '@prince8verma/react-native-snackbar';
import Toast from 'react-native-root-toast';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PushNotification from 'react-native-push-notification';
class Footer extends Component{

  constructor(props) {
    super(props);
    // this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.state={
      name:''
    }
  }

  _loadInitialState= async() =>{
   
    //  Alert.alert(await AsyncStorage.getItem('user'));
      this.setState({
        user:await AsyncStorage.getItem('user')
      })

      console.log(JSON.stringify({
       
        id: this.props.UserId,
        
      }))
      
      fetch('http://203.190.153.20/primeclient/primeclientApi/Api/get_user_info',{
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
         
                  id: this.state.user,
                  
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                this.setState( { data: responseJson });
                
                this.setState({ myData: this.state.data['data'] })
              //  console.log(this.state.myData)
                this.setState({
                  name: this.state.myData['first_name'],
                  
                })
                // console.log(this.state.buyingRate, this.state.sellingRate, this.state.timeDepositefor1M, this.state.timeDepositefor5M)
         
            }).catch((error) => {
              console.error(error);
            });


            fetch('http://203.190.153.20/primeclient/primeclientApi/Api/unread_notifications',{
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
         
                  id: this.state.user,
                  
                })
            }).then((response) => response.json())
            .then((responseJson) => {
                this.setState( { newdata: responseJson });
                console.log(this.state.newdata)
                
                // console.log(this.state.notification)
                // console.log( counti)
                if(this.state.newdata['status']=="1"){
  
                  this.setState({ notification: this.state.newdata['data'] })
                  this.setState({alert:this.state.notification})
                var counti = Object.keys(this.state.notification).length;
                this.setState({
                  count:counti,
                  status:this.state.newdata['status']
                })
                
                // console.log(this.state.status1)

                let toast= Toast.show("You have recieved "+counti+" Notification", {
                  duration: Toast.durations.LONG,
                  position: Toast.positions.TOP,
                  shadow: true,
                  animation: true,
                  hideOnPress: true,
                  delay: 0,
                  
                  onHide: () => {
                    fetch('http://203.190.153.20/primeclient/primeclientApi/Api/check_balance',{
                      method: 'POST',
                      headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                 
                          id: this.state.user,
                          
                        })
                    }).then((response) => response.json())
                    .then((responseJson) => {
                        this.setState( { data: responseJson });
                         console.log(this.state.data)
                        if(this.state.data['status']==1){
                           this.setState({
                              balanceData:this.state.data['data']
                           })
                           if(this.state.balanceData['status']==0){
                            setTimeout(() => this.setState({
                              visible: true,
                              showAlert:true
                          }), 2000);
                           }
                        }
                        
                        
                    }).catch((error) => {
                      console.error(error);
                    }); 
  
                    setTimeout(() => this.setState({
                      // visible: true,
                      showAlert:true
                  }), 2000);
                  },
                  onHidden: () => {
                      // calls on toast\`s hide animation end.
                  }
              });
  
              setTimeout(function () {
                Toast.hide(toast);
            }, 5000);
                }
                else{
                  fetch('http://203.190.153.20/primeclient/primeclientApi/Api/check_balance',{
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
               
                        id: this.state.user,
                        
                      })
                  }).then((response) => response.json())
                  .then((responseJson) => {
                      this.setState( { data: responseJson });
                       console.log(this.state.data)
                      if(this.state.data['status']==1){
                         this.setState({
                            balanceData:this.state.data['data']
                         })
                         console.log(this.state.balanceData)
                         if(this.state.balanceData['status']==0){
                          setTimeout(() => this.setState({
                            visible: true,
                            
                        }), 2000);
                         }
                      }
                      
                      
                  }).catch((error) => {
                    console.error(error);
                  }); 
                }
                var counti= 
               console.log(this.state.notification)
                
            }).catch((error) => {
              console.error(error);
            });

            // PushNotification.configure({


            //   onNotification: function(notification) {
            //     console.log( 'NOTIFICATION:', notification );
            //     this.read_notifications
               
            //   },
            
            //   // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
            //   senderID: "91663435700",
            
            
            // });
  
    }

    // read_notifications=()=>{
    //   fetch('http://203.190.153.20/primeclient/primeclientApi/Api/unread_notifications',{
    //               method: 'POST',
    //               headers: {
    //                   Accept: 'application/json',
    //                   'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify({
             
    //                   id: this.state.user,
                      
    //                 })
    //             }).then((response) => response.json())
    //             .then((responseJson) => {
    //                 this.setState( { newdata: responseJson });
    //                 console.log(this.state.newdata)
                    
    //                 // console.log(this.state.notification)
    //                 // console.log( counti)
    //                 if(this.state.newdata['status']=="1"){
      
    //                   this.setState({ notification: this.state.newdata['data'] })
    //                   this.setState({alert:this.state.notification})
    //                 var counti = Object.keys(this.state.notification).length;
    //                 this.setState({
    //                   count:counti,
    //                   status:this.state.newdata['status']
    //                 })
                    
    //                 // console.log(this.state.status1)
    
    //               //   let toast= Toast.show("You have recieved "+counti+" Notification", {
    //               //     duration: Toast.durations.LONG,
    //               //     position: Toast.positions.TOP,
    //               //     shadow: true,
    //               //     animation: true,
    //               //     hideOnPress: true,
    //               //     delay: 0,
                      
    //               //     onHide: () => {
    //               //       setTimeout(() => this.setState({
    //               //         // visible: true,
    //               //         showAlert:true
    //               //     }), 2000);
    //               //     },
    //               //     onHidden: () => {
    //               //         // calls on toast\`s hide animation end.
    //               //     }
    //               // });
    //                 }
                    
                    
    //             }).catch((error) => {
    //               console.error(error);
    //             });
    // }

  componentDidMount(){

    this._loadInitialState().done()


   

  }

   render(){
   
   

    return(
        

      <View style={styles.nav}>
      
      <TouchableOpacity
       onPress={() => {
        this.props.navigation.dispatch(StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Dashboard' })
          ],
        }))
      }} >
        
              <View style={{ borderColor:this.props.Page=="Home"?"#0f0":"#fff", marginTop:0, borderWidth:2, borderRadius:50}}>
              <Image style={{height:35, width:35, resizeMode:"contain"}} source={require('../assets/images/home.png')}/>
              </View>
              <Text style={{fontFamily:"Raleway-Bold"}}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: 'Transiction' , params:{id:this.props.UserId, name:this.state.name} })
                ],
              })) 
            }} >
              <View style={{ borderColor:this.props.Page=="Transiction"?"#0f0":"#fff", marginTop:0, borderWidth:2, borderRadius:50}}>
              <Image style={{height:35, marginLeft:20, width:35, resizeMode:"contain"}} source={require('../assets/images/transiction.png')}/>
               
              </View>
              <Text style={{fontFamily:"Raleway-Bold"}}>Transaction</Text>
          </TouchableOpacity>
         <TouchableOpacity
          onPress={() => {
            this.props.navigation.dispatch(StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({ routeName: 'Notification' , params:{id:this.props.UserId, name:this.state.name} })
              ],
            })) 
          }}>
               <View style={{ borderColor:this.props.Page=="Inbox"?"#0f0":"#fff", marginTop:0, borderWidth:2, borderRadius:50}}>
               <Image style={{height:35, width:35, resizeMode:"contain"}}  source={require('../assets/images/inbox.png')}/>
               
               </View>
                {
                  this.state.status=="1"? <View style={{heigh:20, width:20, position:"absolute", top:0, left:15, borderRadius:10, backgroundColor:"#f00"}}>
                  <Text style={{color:"#fff", textAlign:"center"}}>{this.state.count.toString()}</Text>
                  </View>:null
                } 
                <Text style={{fontFamily:"Raleway-Bold"}}>Inbox</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: 'UserProfile' , params:{id:this.props.UserId, name:this.state.name} })
                ],
              })) 
            }}>
               <View style={{ borderColor:this.props.Page=="Profile"?"#0f0":"#fff", marginTop:0, borderWidth:2, borderRadius:50}}>
               <Image style={{height:35, width:35, resizeMode:"contain"}} source={require('../assets/images/user.png')}/>
              
               </View>
                <Text style={{fontFamily:"Raleway-Bold"}}>User</Text>
          </TouchableOpacity>
      </View>
          )
   }
}

export default  withNavigation(Footer);