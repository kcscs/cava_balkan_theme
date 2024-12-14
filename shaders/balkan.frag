#version 330

in vec2 fragCoord;
out vec4 fragColor;

// bar values. defaults to left channels first (low to high), then right (high to low).
uniform float bars[512];

uniform int bars_count;    // number of bars (left + right) (configurable)
uniform int bar_width;    // bar width (configurable), not used here
uniform int bar_spacing;    // space bewteen bars (configurable)

uniform vec3 u_resolution; // window resolution

//colors, configurable in cava config file (r,g,b) (0.0 - 1.0)
uniform vec3 bg_color; // background color
uniform vec3 fg_color; // foreground color

uniform int gradient_count = 3;
uniform vec3 gradient_colors[8]; // gradient colors
// uniform vec3 gradient_colors[3] = vec3[3]( // Serbia
//     vec3(0.863, 0.122, 0.149),
//     vec3(0.141,0.243,0.525),
//     vec3(1,1,1)
// ); // gradient colors

uniform float drop_thresh = 0.6;







// // shamelessly stolen from shadertoy: https://www.shadertoy.com/view/MffyDr
// float N = 6.;

// mat2 rot(float angle) {
//     float c = cos(angle);
//     float s = sin(angle);
//     return mat2(c, -s, s, c);
// }

// void bars2(inout vec3 col, vec3 barCol, vec2 uv) {
//     float f = abs(fract(uv.y + 0.5) - 0.5);
//     f = smoothstep(0.06, 0.0, f);
    
//     col = mix(col, barCol, f);
// }

// vec3 hueToRGB(float hue) {
//     // Spaghetti courtesy of my Desmos tomfoolery:
//     // https://www.desmos.com/calculator/gwuinskaqy
//     return clamp(abs(6.*fract(hue - vec3(0., 1., 2.)/3.0)-3.0) - 1.0, 0.0, 1.0);
// }

// void mainImage( out vec4 fragColor, in vec2 fragCoord )
// {
//     // Normalized pixel coordinates (from 0 to 1)
//     // vec2 uv = (fragCoord - 0.5 * iResolution.xy)/iResolution.xx;
//     vec2 uv = fragCoord;
//     uv *= 20.0;

//     // Time varying pixel color
//     vec3 col = vec3(0);
    
//     mat2 R = rot(radians(180.0 / N));
    
//     for (float i = 0.0; i < N; i+=1.0) {
//         // Fade color to white for higher N to avoid visual overload
//         vec3 barCol = clamp(hueToRGB(i/N) + smoothstep(3., 5., N), 0., 1.);
//         bars2(col, barCol, uv);
//         uv *= R;
//     }
//     // Output to screen
//     fragColor = vec4(col,1.0);
// }









// shamelessly stolen from shadertoy: https://www.shadertoy.com/view/ftG3zz
// uniform float  iTime = 0.0f;
//change these constants to get different patterns!
#define c2 0.0

#define c1 vec4(3.0+c2,2.5+c2,1.5,0)
//#define c1 vec4(2.0+c2,1.5+c2,1.4,0)
//#define c1 vec4(1.0,1.5,1.4,0)
//#define c1 vec4(7.0,5.0,1.4,0)
//#define c1 vec4(7.0,9.0,1.4,0)
//#define c1 vec4(5.0,5.5,1.4,0)

vec3 hash31(float p)
{
    //from David Hoskin's "Hash without sine"
   vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
   p3 += dot(p3, p3.yzx+33.33);
   return fract((p3.xxy+p3.yzz)*p3.zyx); 
}

vec2 triangle_wave(vec2 a,float scale){
    return abs(fract((a+c1.xy)*scale)-.5);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord, float t_offset )
{
    fragColor = vec4(0.0);
    
    
    float iTime = t_offset;
    
    vec3 col;  
    float t1 = 4.5;

    // vec2 uv = (fragCoord-iResolution.xy)/iResolution.y/t1/2.0;
    vec2 uv = fragCoord/2;
    uv += vec2(iTime/2.0,iTime/3.0)/t1/5.0;
    //vec3 random1 = hash31(floor((iTime)/10.0+uv.x))*10.*.0;
    //vec3 random2 = hash31(1.+floor((iTime)/10.0+uv.x));
    float t2 = floor((iTime/2.+uv.x)/10.0);
    vec3 random1 = (hash31(3.+t2)-.5)/12.;
    vec3 random2 = (hash31(4.+t2)-.5)/12.;
    vec3 random3 = (hash31(3.+t2)-vec3(.5))/1.5;
    //vec3 random4 = (hash31(4.+t2)-vec3(.5))/4.;
    
    float offset = .5;
    float scale2 = 1.5;
    float bend = 1.;
    for(int c=0;c<3;c++){
        float scale = c1.z;
        //float scale1 = 1.0;
        for(int i=0;i<3;i++)
        {
            
            for(int k = 0; k < 8; k++){    
                uv /= -scale2;
                // float bend = 1.+random3[k];
                // bend = abs(fract((uv.x)*2.)-.5)/2.+1.;
                // bend = 1.+1./3.;
                // bend = scale2/1.5;
                
                // bend = abs(fract(((uv.x*bend+uv.y/bend)/scale2))-.5)+1.-col.x;

                
                uv.yx = -triangle_wave(uv.yx-offset,scale)/bend-triangle_wave(uv,scale)*bend;
                //uv += uv.yx*col.x/2.;
                //bend += 1./(1.+uv.x+uv.y);
                //bend = 1./bend;
                //bend *= -1.;
                //uv += vec2(random1[k],random2[k]);   
                bend *= -1.;
                //uv /= -1.0;
                //scale -= .001;
                
            }
            
            

            //offset += .5;
            scale /= 1.+(scale2)*col.x/(4.);
            scale2 -= (col.x-1.)/(4.);


            col[c] = abs((uv.x)-(uv.y));
            //random2 = col - random2;
            

        }
	}
    
    fragColor = vec4(vec3(col*2.)*0.2,1.0);
    
}












vec4 get_bg_color(vec2 coord, float t, float drop_y) {
    vec4 col;
    mainImage(col, coord, t*5);

    if(drop_y > drop_thresh){
        float above_drop = (drop_y-drop_thresh)/(1-drop_thresh);
        above_drop = above_drop;
        col *= above_drop*5;
    }
    return col;
}



vec3 normalize_C(float y,vec3 col_1, vec3 col_2, float y_min, float y_max)
{
    //create color based on fraction of this color and next color
    float yr = (y - y_min) / (y_max - y_min);
    return col_1 * (1.0 - yr) + col_2 * yr;
}

void main()
{
    // find which bar to use based on where we are on the x axis
    float x = u_resolution.x * fragCoord.x;
    int bar = int(bars_count * fragCoord.x);

    //calculate a bar size
    float bar_size = u_resolution.x / bars_count;

    //the y coordinate and bar values are the same
    float y =  bars[bar];

    float drop_y = 0.0f;
    int mid_start = int(bars_count * 0.4);
    int mid_end = int(bars_count * 0.6);
    for(int i = mid_start; i < mid_end; ++i){
        if(bars[i] > drop_y)
            drop_y = bars[i];
    }
    drop_y = drop_y;


    float avg_y = 0.0f;
    for(int i = 0; i < bars_count; ++i){
        avg_y += bars[i];
    }
    avg_y /= bars_count;

    // make sure there is a thin line at bottom
    if (y * u_resolution.y < 1.0)
    {
      y = 1.0 / u_resolution.y;
    }

    //draw the bar up to current height
    if (y > fragCoord.y)
    {
        //make some space between bars basen on settings
        if (x > (bar + 1) * (bar_size) - bar_spacing)
        {

            fragColor = get_bg_color(fragCoord,avg_y,drop_y);
        }
        else
        {
            // if (gradient_count == 0)
            // {
            //     fragColor = vec4(fg_color,1.0);
            // }
            // else
            {
                //find which color in the configured gradient we are at
                int color = int((gradient_count - 1) * fragCoord.y);

                //find where on y this and next color is supposed to be
                float y_min = color / (gradient_count - 1.0);
                float y_max = (color + 1.0) / (gradient_count - 1.0);

                //make color
                // fragColor = vec4(normalize_C(fragCoord.y, gradient_colors[color], gradient_colors[color + 1], y_min, y_max), 1.0);
                fragColor = vec4(mix(gradient_colors[color], gradient_colors[color + 1], (fragCoord.y-y_min)/(y_max-y_min)),1.0);
            }
        }
    }
    else
    {
        fragColor = get_bg_color(fragCoord,avg_y,drop_y);
    }
}