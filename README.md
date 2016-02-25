# ng-pull
[![Build Status](https://travis-ci.org/FDIM/ng-pull.svg?branch=master)](https://travis-ci.org/FDIM/ng-pull)
[![Coverage Status](https://coveralls.io/repos/github/FDIM/ng-pull/badge.svg?branch=master)](https://coveralls.io/github/FDIM/ng-pull?branch=master)

A set of directives allowing you to implement pull to action pattern, either vertically or horizontally.

Live Demo: http://fdim.github.io/ng-pull/example/

## installation
As simple as "bower install ng-pull" :)

## usage

To use this pull gesture, simply add on-pull-(down|up|left|right) attribute with an expression to execute when progress reaches 100%. If expression evaluates to false, item will remain pushed until $reset function is invoked. 


```
<div class="container items-list" on-pull-down="loadNewItems()" pull-down-distance="60" pull-down-progress="$pullDownProgress" on-pull-up="loadMoreItems($reset)" pull-up-distance="60" pull-up-progress="$pullUpProgress">
      <div pull-down-container>
          <div>{{$pullDownProgress|number:2}}</div>
          <div>{{$pullDownProgress==100?'Release to request new items':'Pull down to refresh'}}</div>
      </div>
      <ul pull-target>
        <li ng-repeat="i in items" pull-left-disabled="i.disabled" on-pull-left="false" pull-left-distance="120" pull-left-reset="$cancelDelete" pull-left-progress="$pullLeftProgress" on-pull-right="archiveItem(i)" pull-right-distance="150" pull-right-disabled="i.disabled">
          <div pull-right-container>
            <p style="padding-top:20px; text-align:right;">{{$pullRightProgress|number:2}} archived</p>
          </div>
          <div pull-target>
            <div class="image"></div>
            <div class="content">
              <h3>{{i.title}}</h3>
              <p>{{i.intro}}</p>
            </div>
          </div>
          <div pull-left-container>
            <p style="padding-top:20px;" ng-if="$pullLeftProgress<100">{{$pullLeftProgress|number:2}} deleted</p>
            <p style="padding-top:20px;" ng-if="$pullLeftProgress==100">
              <button ng-click="$cancelDelete(i)">cancel</button>
              <button ng-click="removeItem(i)">delete</button>
            </p>
          </div>
        </li>
      </ul>
      <div pull-up-container style="text-align:center;">
          <div>{{$pullUpProgress|number:2}}</div>
          <div ng-if="!loadingMore">{{$pullUpProgress==100?'Release to begin loading':'Pull down to load more'}}</div>
          <div ng-if="loadingMore">Please wait, loading</div>
      </div>
    </div>
    
```

Have a look at the example for more details.

## options
You can customise behavior by providing additional attributes:
* pull-(down|up|left|right)-distance : number of pixels user has to move the element in order to trigger the expression. Default:100
* pull-(down|up|left|right)-progress : scope variable name to store progress value. Default: $pull(Down|Up|Left|right)Progress
* pull-(down|up|left|right)-threshold : progress value to cancel the gesture if it is not reached within timeout. Default: 5
* pull-(down|up|left|right)-timeout : number of ms given for the user to reach threshold value or gesture will be cancelled. Default: 300
* pull-(down|up|left|right)-disabled : an expression to watch to enable or disable gesture
* pull-(down|up|left|right)-reset : scope variable name to expose reset function. Default: $pull(Down|Up|Left|right)Reset

Note that directives are not using isolated scope.
