/* COPYRIGHT 2012 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/


/**
 * Class: SuperMap.REST.FacilityAnalystUpstream3DEventArgs
 * 上游关键设施查找资源服务事件数据类
 *
 * Inherits from:
 *  - <SuperMap.ServiceEventArgs> 
 */
SuperMap.REST.FacilityAnalystUpstream3DEventArgs = SuperMap.Class(SuperMap.ServiceEventArgs, {
    
    /** 
     * APIProperty: result
     * {<SuperMap.REST.FacilityAnalystUpstream3DResult>} 
	 */
    result: null,
    
    /**
     * Constructor: SuperMap.REST.FacilityAnalystUpstream3DEventArgs
     * 上游关键设施查找资源服务事件数据类构造函数。
     *
     * Parameters:
     * result - {<SuperMap.REST.FacilityAnalystUpstream3DResult>} 
     * originResult - {Object} 服务端返回的存储了最近设施分析结果数据的 JSON 字符串。 
     */
    initialize: function(result,originResult) {
        SuperMap.ServiceEventArgs.prototype.initialize.apply(this, [originResult]);
        var me = this;
        me.result = result;
    },
    
    /**
     * APIMethod: destroy
     * 释放资源，将引用资源的属性置空。  
     */
    destroy: function() {
        SuperMap.ServiceEventArgs.prototype.destroy.apply(this);
        var me = this;
        if (me.result) {
            me.result.destroy();
            me.result = null;
        }
    },
    
    CLASS_NAME: "SuperMap.REST.FacilityAnalystUpstream3DEventArgs"
})