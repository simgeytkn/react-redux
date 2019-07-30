import { combineReducers } from 'redux';
import form from './form'
import order from './order'
import normal from './normal'
import offset from './offset'

export default combineReducers({
    forms: form,
    ordered: order,
    normal: normal,
    offset: offset
});