import jotformapi from '../api/jotformapi';
import limit from '../values'
export const getForm = (apiKey,offset) => async (dispatch, test) => {
    console.log("Limit",limit)
    console.log("Test is: ",test())
    const response = await jotformapi.get('/user/forms?apiKey='+apiKey+'&offset='+offset+'&limit='+limit);
    if(response.data.content.length !== 0){
        var order =  response.data.content.filter(el => 
            el.title.indexOf('Order') !== -1
        )
        var normal_form = response.data.content.filter(el => 
            el.title.indexOf('Order') === -1
        )
        dispatch({
            type: 'GET_FORM',
            payload: {
                all: response.data.content,
                ordered: order,
                normal: normal_form
            }
        })
        dispatch({
            type: 'OFFSET'
        })
    }
}

export const orderComplete = (apiKey,formId) => async dispatch => {
    const questions =  [
        {
            type: "control_checkbox",
            text: "Order Complited",
            options: "Completed",
            name: 'app_order_complited'
        },
        {
            type: "control_textarea",
            text: "Order Textarea",
            name: "orderDetails"
        }
    ]
    await jotformapi.put('/form/'+formId+'/questions?apiKey='+apiKey, {questions});
}


export const changeTitle = (apiKey,formId,new_text) => async (dispatch,store) => {
    const properties = {
        title: new_text
    }
    await jotformapi.put('/form/'+formId+'/properties?apiKey='+apiKey, {properties});
  
}

export const swap = (id,title) => async dispatch => {
    const response = await jotformapi.get('/user/forms?apiKey='+'c9200350c71441cc7e2ad48f7f0f7d21');
    if(response.data.content.length !== 0){
        var order =  response.data.content.filter(el => 
            el.title.indexOf('Order') !== -1
        )
        var normal_form = response.data.content.filter(el => 
            el.title.indexOf('Order') === -1
        )
    }
    dispatch({
        type: 'ADD_ITEM',
        payload: {
            id: id,
            title: title,
            ordered: order,
            normal: normal_form
        }
    })
    dispatch({
        type: 'REMOVE_ITEM',
        payload: {
            id: id,
            title: title
        }
    })
}

export const submission = (formId,apiKey) => async dispatch => {
    const response = await jotformapi.get('/form/'+formId+'/submissions?apiKey='+apiKey)
    console.log(response.data.content.map(el => el.answers))
    dispatch({
        type: 'VIEW ORDER',
        peyload: {
            orderView: response.data.content.answers
        }
    })

}