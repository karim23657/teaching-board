 const videoElement = document.getElementsByClassName('input_video')[0];
  const canvasElement = document.getElementsByClassName('output_canvas2')[0];

// Set canvas width & height
/*canvasElement.width=640;
canvasElement.height=480;
*/
  const canvasCtx = canvasElement.getContext('2d');
  const img = document.getElementById("vbackground");
  var c=location.href;
  var datapath=c.substr(0,c.lastIndexOf('/')+1);
  
  
  

function mask_process(image,w,h){
	var elm=document.createElement('canvas');
	elm.width=w;
	elm.height=h;
	var ctx=elm.getContext('2d');
	ctx.drawImage(image, 0, 0, w, h);
	
	
	
	var threshold=obj.threshold;
	
	var d = ctx.getImageData(0, 0,w,h);  // Get image Data from Canvas context
	for (var i=0; i<d.data.length; i+=4) { 
		// 4 is for RGBA channel
		// R=G=B=R>T?255:0
		d.data[i] = d.data[i+1] = d.data[i+2] = d.data[i+3] > threshold ? 0 : 255;
		if (d.data[i + 0] == 0 || d.data[i + 1] == 0 || d.data[i + 2] == 0 )    {
			d.data[i + 0] = 0;
			d.data[i + 1] = 0;
			d.data[i + 2] = 0;
					
		} else {
			d.data[i + 0] = 255;
			d.data[i + 1] = 255;
			d.data[i + 2] = 255;
			d.data[i + 3] = 1;
			}
	}
	ctx.clearRect(0, 0,  w, h);
	ctx.filter = `blur(${obj.blur_m}px)`
	ctx.putImageData(d, 0, 0); 
	return elm
	
	
	
}
function image_process(image,w,h){
	var elm=document.createElement('canvas');
	elm.width=w;
	elm.height=h;
	var ctx=elm.getContext('2d');
	ctx.filter = `blur(${obj.blur}px) opacity(${obj.opacity}%) brightness(${obj.brightness}%) contrast(${obj.contrast}%) saturate(${obj.saturate}%)`;
	ctx.drawImage(image, 0, 0, w, h);
	return elm
	}

  function onResults(results) {
    // clear canvas
	
	canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    
    // canvasCtx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);

    

    // // Blur the context for all subsequent draws then set the raw image as the background
    // // canvasCtx.filter = 'blur(16px)';
	
    /*
	canvasCtx.globalCompositeOperation = 'destination-over';
    canvasCtx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);
	*/
	canvasCtx.filter = 'none';
		canvasCtx.drawImage(image_process(results.image,canvasElement.width, canvasElement.height), 0, 0, canvasElement.width, canvasElement.height);
		canvasCtx.globalCompositeOperation = 'destination-atop';
		canvasCtx.drawImage(mask_process(results.segmentationMask,canvasElement.width, canvasElement.height), 0, 0, canvasElement.width, canvasElement.height);
	
    if(obj.BlurBackground){
		
		var elm=document.createElement('canvas');
	elm.width=canvasElement.width;
	elm.height=canvasElement.height;
	var ctx=elm.getContext('2d');
	ctx.filter =`blur(${obj.BlurBg}px) opacity(${obj.opacity_bg}%) brightness(${obj.brightness_bg}%) contrast(${obj.contrast_bg}%) saturate(${obj.saturate_bg}%)`;
	ctx.drawImage(results.image, 0, 0,canvasElement.width, canvasElement.height);
	
	canvasCtx.globalCompositeOperation = 'destination-over';
	canvasCtx.drawImage(elm, 0, 0, canvasElement.width, canvasElement.height);
	
	}else if(obj.virtualBackground && virtualBg_img != ''){
		var elm=document.createElement('canvas');
	elm.width=canvasElement.width;
	elm.height=canvasElement.height;
	var ctx=elm.getContext('2d');
	ctx.filter =`blur(${obj.BlurBg}px) opacity(${obj.opacity_bg}%) brightness(${obj.brightness_bg}%) contrast(${obj.contrast_bg}%) saturate(${obj.saturate_bg}%)`;
	ctx.drawImage(virtualBg_img, 0, 0,canvasElement.width, canvasElement.height);
	
	canvasCtx.globalCompositeOperation = 'destination-over';
	canvasCtx.drawImage(elm, 0, 0, canvasElement.width, canvasElement.height);
	
	}
	
  }

  const selfieSegmentation = new SelfieSegmentation({locateFile: (file) => {
    return `${datapath}data/${file}`;
  }});
  selfieSegmentation.setOptions({
    modelSelection: 1,
  });
  selfieSegmentation.onResults(onResults);

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await selfieSegmentation.send({image: videoElement});
    },
    width: 256,
    height: 144
  });
  camera.start();
  
  
  
  
  
  
  
  
