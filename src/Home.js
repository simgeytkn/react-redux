import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getForm,orderComplete, changeTitle, swap, offset } from './action/index';
import './style.css';
import { debounce } from './throttle';
import { Link } from 'react-router-dom';
import { Grid, Icon, Menu, Input, Image,Button, Header, Modal } from 'semantic-ui-react';

class Home extends Component {
    constructor(props){
        super(props);
        this.error = false
        this.getForms = this.getForms.bind(this)
        this.state={
            apiKey: '',
            open: false
        }
        this.convertOrder = this.convertOrder.bind(this)

        window.addEventListener('scroll', debounce(this.callback, 100));
    }

    handleConfirm = () => this.setState({ open: false })
    handleCancel = () => this.setState({ open: false })
    componentWillUnmount() {
        window.removeEventListener('scroll', this.debounce)
    }

    convertOrder = (el)  => {
        var formTitle = el.title
        if(el.title.includes('Order') === false){
            var title = {
                text: formTitle + "(Order)"
            }            
        }else{
            alert("It is ordered")
            var title = {
                text: formTitle
            }
        }

        this.setState({
            head: formTitle
        })
        
        this.props.orderComplete(this.state.apiKey,el.id)
        this.props.changeTitle(this.state.apiKey,el.id,title.text) 
        this.props.swap(el.id,title.text)
    }

    viewOrder = (el) => {
        this.setState({ open: true })
        console.log(el)
        this.props.submission(el.id,this.state.apiKey)
    }

    inputKey = (e) => {
        const new_apiKey = e.target.value
        this.setState({
            apiKey: new_apiKey
        })
        
    }

    getForms = () => {
        this.props.getForm(this.state.apiKey,this.props.offset)
    }

    scroll = (e) => {
        var element = e.target
        console.log(this.props.offset)
        if(element.scrollHeight - element.scrollTop === element.clientHeight){
            this.getForms()
        }
        
    }

    render(){
        console.log(this.props.offset)
        if(!this.error){
            return(
                <div className="search">
                    {this.props.form.length ? null  : 
                    <Grid centered>
                        <Grid.Column width={4}>
                            <Input icon={{ name: 'search', circular: true, link: true }} placeholder='Enter API Key' id="apiKey" onBlur={this.inputKey} defaultValue="c9200350c71441cc7e2ad48f7f0f7d21"/>
                        </Grid.Column>
                        <Grid.Column width={2}>
                        <Link to='/'> 
                                <button className="enterButton" onClick={this.getForms}>
                                    Enter
                                </button>
                            </Link> 
                        </Grid.Column>
                    </Grid>}
                    {this.props.form.length ?
                    <Grid className="context">
                          <Grid.Column id="borderRight" width={4} >
                            <Image className="podo" src="https://cdn.jotfor.ms/assets/img/memberkit/user_guide_images/f1.png?v=0.2" circular/>
                            <Menu text vertical className="leftMenu">
                                <Menu.Item>
                                    <Link to="order" onClick={this.getForms} className="links">
                                        <span>ORDERED</span>
                                        <Icon name='chevron right' />
                                    </Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <Link to="normal" onClick={this.getForms} className="links">
                                        <span>NORMAL</span>
                                        <Icon name='chevron right' />
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        </Grid.Column>
                        <Grid.Column width={10}> 
                            <ul onScroll={this.scroll}>   
                                {this.props.form.map((el,index) => 
                                    <li key={index} id={el.id}>
                                        {el.title}
                                        <div className="buttons">
                                            {el.title.indexOf('Order') === -1 ? 
                                                <Button title={el.title} id={el.id} onClick={() => this.convertOrder(el)}>
                                                    Convert To Order Form  
                                                </Button>
                                                : 
                                                <Modal trigger={<Button onClick={() => this.viewOrder(el)}>View Order</Button>} closeIcon>
                                                    <Header icon='archive' content='Submissions of Form' />
                                                    <Modal.Content>
                                                        <p>
                                                            This is Modal Content Simge :)
                                                        </p>
                                                    </Modal.Content>
                                                </Modal>
                                            }
                                        </div>
                                    </li>
                                )} 
                            </ul>
                        </Grid.Column>
                    </Grid> : null }
                </div>
            )
        }
    }
}

const mapStateToProps = (state,ownProps) => {
    return {
        form: ownProps.match.path === '/' ? state.forms  : null  ||
                ownProps.match.path === '/order' ? state.ordered : null ||
                ownProps.match.path === '/normal' ? state.normal : null,
        offset : state.offset
    }
}

export default connect(
    mapStateToProps,
    { getForm,orderComplete, 
    changeTitle,swap,offset}
)(Home);


