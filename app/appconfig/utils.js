import Ember from 'ember';
import Constants from 'waweb/appconfig/constants';

var Utils = {};


Utils.itemTypeIsParent = function (itemType) {
	return itemType >= Constants.ITEM_TYPES_BY_NAME["COUNTRY"] && itemType < Constants.ITEM_TYPES_BY_NAME["NEIGHBORHOOD"]
};

Utils.itemTypeIsAttraction = function (itemType) {
	return itemType >= Constants.ITEM_TYPES_BY_NAME["ATTRACTION"]
};

export default Utils;
