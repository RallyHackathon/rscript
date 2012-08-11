# rallyscript

rallyscript is a DSL written in JavaScript with the overall goal of making Rally App SDK 2.0 apps easier to write for casual users. The target audience is people who don't necessarily know Ext (but ideally are comfortable with JavaScript) and want to whip something together quickly and for the most part use SDK components "out of the box".
  
Stretch goals include ways to truly write powerful/custom apps using just the rallyscript DSL.

## Pros
1. The API is very simple, intuitive and doesn't have very many assumptions or expectations
2. Users need to know nothing about lifecycles of components.
3. Apps written in rallyscript, so far, are much shorter and easier to injest than their regular JS counterparts
  
## Cons
1. There's no way this DSL on its own could ever match the power and flexibility of pure Ext and the Rally SDK
2. Debugging sucks (you drop into the DSL's implementation all the time)
3. Difficult to know before hand if the DSL will meet your needs or not

## How to write a rallyscript app

Create an HTML page that pulls in the Rally App SDK (just like a normal app). rallyscript is being written against the App SDK v 2.0p3. Then pull in the `rscript.debug.js` or `rscript.min.js` script and ddd a script tag to your page with type set to `rscript`. Write your app in this script tag.

      <script type="rscript">
          var t = text('here is an iteration combobox');
          var ic = iterationCombobox();
          launch(t, ic);
      </script>

See the `sandbox/` directory for some examples. `storyBoard.html` is [this app](https://rally1.rallydev.com/apps/2.0p3/doc/#!/guide/appsdk_20_first_app) rewritten in rscript

## So ... what is rallyscript?

It's just JavaScript that is ran in an environment with lots of goodies available for building apps. In the above example, `text()` and `iterationCombobox()` look like global functions and you might think they are defined at `window.text` and `window.iterationCombobox`. What is actually happening is the above rscript block gets turned into this:

      function(text, iterationCombobox, cardboard, launch /* and everything else rallyscript provides */) {
           var t = text('here is an iteration combobox');
           // ....
      }

So within rallyscript, anything that is legal JavaScript is also legal in rallyscript.

## Debugging

The only way you can debug rallyscript apps is to add `debugger` statements to your code. Browsers won't honor breakpoints in rallyscript script tags. Truth be told debugging is a huge negative to this idea. Ideally rallyscript apps will be clear enough and simple enough that debugging them will be a rarity. Crossing fingers.

## Known issues

You can blow away the provided environment very easily by doing this

      <script type='rscript'>
           var text = text('doh, the local text reference just got redefined');
           var text2 = text('and this wont work');	
      </script>

Not yet sure what to do about that, it sucks.
