"use strict";if(L.Browser.svg){L.Path.include({_resetTransform:function(){this._container.setAttributeNS(null,"transform","")},_applyTransform:function(t){this._container.setAttributeNS(null,"transform","matrix("+t.join(" ")+")")}})}else{L.Path.include({_resetTransform:function(){if(this._skew){this._skew.on=false;this._container.removeChild(this._skew);this._skew=null}},_applyTransform:function(t){var i=this._skew;if(!i){i=this._createElement("skew");this._container.appendChild(i);i.style.behavior="url(#default#VML)";this._skew=i}var a=t[0].toFixed(8)+" "+t[1].toFixed(8)+" "+t[2].toFixed(8)+" "+t[3].toFixed(8)+" 0 0";var n=Math.floor(t[4]).toFixed()+", "+Math.floor(t[5]).toFixed()+"";var s=this._container.style;var r=parseFloat(s.left);var o=parseFloat(s.top);var e=parseFloat(s.width);var h=parseFloat(s.height);if(isNaN(r))r=0;if(isNaN(o))o=0;if(isNaN(e)||!e)e=1;if(isNaN(h)||!h)h=1;var _=(-r/e-.5).toFixed(8)+" "+(-o/h-.5).toFixed(8);i.on="f";i.matrix=a;i.origin=_;i.offset=n;i.on=true}})}"use strict";L.Path.Drag=L.Handler.extend({initialize:function(t){this._path=t;this._matrix=null;this._startPoint=null;this._dragStartPoint=null},addHooks:function(){this._path.on("mousedown",this._onDragStart,this);L.DomUtil.addClass(this._path._container,"leaflet-path-draggable")},removeHooks:function(){this._path.off("mousedown",this._onDragStart,this);L.DomUtil.removeClass(this._path._container,"leaflet-path-draggable")},moved:function(){return this._path._dragMoved},_onDragStart:function(t){this._startPoint=L.point(t.containerPoint);this._dragStartPoint=L.point(t.containerPoint.x,t.containerPoint.y);this._matrix=[1,0,0,1,0,0];this._path._map.on("mousemove",this._onDrag,this).on("mouseup",this._onDragEnd,this);this._path._dragMoved=false},_onDrag:function(t){var i=t.containerPoint.x;var a=t.containerPoint.y;var n=i-this._startPoint.x;var s=a-this._startPoint.y;if(!this._path._dragMoved&&(n||s)){this._path._dragMoved=true;this._path.fire("dragstart")}this._matrix[4]+=n;this._matrix[5]+=s;this._startPoint.x=i;this._startPoint.y=a;this._path._applyTransform(this._matrix);this._path.fire("drag");L.DomEvent.stop(t.originalEvent)},_onDragEnd:function(t){this._path._resetTransform();this._transformPoints();this._path._map.off("mousemove",this._onDrag,this).off("mouseup",this._onDragEnd,this);this._path.fire("dragend",{distance:Math.sqrt(L.LineUtil._sqDist(this._dragStartPoint,t.containerPoint))});this._matrix=null;this._startPoint=null;this._dragStartPoint=null},_transformPoints:function(t){var t=this._matrix;var i=t[0];var a=t[1];var n=t[2];var s=t[3];var r=t[4];var o=t[5];var e=this._path;var h=[];var _,l,f;var g,d,p,u;for(g=0,p=e._originalPoints.length;g<p;g++){f=e._originalPoints[g];_=f.x;l=f.y;f.x=i*_+n*l+r;f.y=a*_+s*l+o;e._originalPoints[g]=f;e._latlngs[g]=this._path._map.layerPointToLatLng(f)}if(e._holes){for(g=0,p=e._holes.length;g<p;g++){for(d=0,u=e._holes[g].length;d<u;d++){f=e._holePoints[g][d];_=f.x;l=f.y;f.x=i*_+n*l+r;f.y=a*_+s*l+o;e._holePoints[g][d]=f;e._holes[g][d]=this._path._map.layerPointToLatLng(f)}}}e._updatePath()}});(function(){var t=L.Path.prototype._initEvents;L.Path.prototype._initEvents=function(){t.call(this);if(this.options.draggable){if(this.dragging){this.dragging.enable()}else{this.dragging=new L.Path.Drag(this);this.dragging.enable()}}else if(this.dragging){this.dragging.disable()}}})();