/*
Author: Chris Humboldt
*/

declare var Hammer: any;

declare interface options {
   targets?: string;
   animation?: string;
   arrows?: boolean;
   arrowsConstraint?: boolean;
   autoFlick?: boolean;
   autoFlickDelay?: number;
   autoStart?: any;
   autoStop?: any;
   count?: number;
   dotAlignment?: string;
   dots?: boolean;
   endPosX?: number;
   elements?: any;
   flickerWidth?: number;
   lastPosXLeft?: number;
   lastPosXPercent?: number;
   panCSS?: string;
   panThreshold?: number;
   position?: number;
   posX?: number;
}
