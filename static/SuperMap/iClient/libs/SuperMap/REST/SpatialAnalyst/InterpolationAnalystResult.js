/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * @requires SuperMap/Util.js
 * @requires SuperMap/REST.js
 * @requires SuperMap/Geometry.js
 * @requires SuperMap/REST/SpatialAnalyst/SpatialAnalystResult.js
 */

/**
 * Class: SuperMap.REST.InterpolationAnalystResult
 * 差值分析分析服务结果数据类
 *
 * Inherits from:
 *  - <SuperMap.REST.SpatialAnalystResult>
 */
SuperMap.REST.InterpolationAnalystResult = SuperMap.Class(SuperMap.REST.SpatialAnalystResult,{
    /**
     * Property: recordset
     * {<SuperMap.REST.Recordset>} 结果记录集。
     */
    recordset: null,

    /**
     * Constructor: SuperMap.REST.InterpolationAnalystResult
     * 插值分析结果构造函数构造函数。
     *
     * Parameters:
     * options - {Object} 可选参数。
     */
    initialize: function (options) {
        SuperMap.REST.SpatialAnalystResult.prototype.initialize.apply(this, arguments);
        if (!options) {
            return;
        }
        SuperMap.Util.extend(this, options);
    },

    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。
     */
    destroy: function () {
        SuperMap.REST.SpatialAnalystResult.prototype.destroy.apply(this, arguments);
        var me = this;
        if (me.recordset) {
            me.recordset.destroy();
            me.recordset = null;
        }
    },

    CLASS_NAME: "SuperMap.REST.InterpolationAnalystResult"
});

SuperMap.REST.InterpolationAnalystResult.fromJson = function (jsonObject) {
    if (!jsonObject) {
        return;
    }
    var result = new SuperMap.REST.InterpolationAnalystResult();

    if (jsonObject.succeed) {
        result.succeed = jsonObject.succeed;
    }

    for (var name in jsonObject) {
        if (name === "recordset") {
            result.recordset = SuperMap.REST.Recordset.fromJson(jsonObject.recordset);
        }
        else {
            result[name] = jsonObject[name];
        }
    }

    return result;
};