//2048js
//

//定义数据结构
var matrix = [//记录位置
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];
var component = new Array();//记录tile
var best = 0;
var score = 0;
//初始化游戏界面
addTiles(2);
//新游戏
document.querySelector(".restart-button").onclick = function() {
  newGame();
  addTiles(2);
};
document.querySelector(".retry-button").onclick = function() {
  newGame();
  addTiles(2);
};

function newGame() {
  score = 0;
  document.querySelector(".score-container").innerText = score;
  matrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  component = new Array();
  document.querySelector('.tile-container').innerHTML = '';

  document.querySelector(".game-message").classList.remove("game-over");
  document.querySelector(".game-message").classList.remove("game-won");
}

//添加n个tile
function addTiles(n) {
  var i = 0;
  while (i < n) {

    var x = Math.floor((Math.random() * 4) + 0);
    var y = Math.floor((Math.random() * 4) + 0);
    if (matrix[x][y] == 0) {//若随机位置为空，放置随机tile
      i++;
      matrix[x][y] = ((Math.random() * 10) > 8) ? 4 : 2;
      component.push({
        x: x,
        y: y
      });

      updateTile(x, y,'tile-new');
    }
  }
}
function updateTile(x, y,state) {
  document.querySelector(".tile-container").innerHTML += "<div class='tile tile-" + Math.abs(matrix[x][y]) + " tile-position-" + (x+1) + "-" + (y+1) + " " + state +" '><div class='tile-inner'>" + Math.abs(matrix[x][y]) + "</div></div>";
}

//键盘操作
window.addEventListener('keydown', this.direction, false);
function direction(e) {
  moveDirection(e.keyCode);
}
//移动端操作-定义滑动手势响应
var myElement = document.getElementsByClassName('game-container')[0];
var hammertime = new Hammer(myElement);
hammertime.get('swipe').set({
  direction: Hammer.DIRECTION_ALL
});

hammertime.on('swipeleft', function(ev) {
  moveDirection(37);
  console.log(37);
});

hammertime.on('swiperight', function(ev) {
  moveDirection(39);
  console.log(39);
});

hammertime.on('swipeup', function(ev) {
  moveDirection(38);
  console.log(38);
});

hammertime.on('swipedown', function(ev) {
  moveDirection(40);
  console.log(40);
});
//方向判断逻辑 
function moveDirection(code) {
  removeAll("tile-new");
  removeAll("tile-merged");
  removeAll("score-addition");
  var change = 0;
  switch (code) {
    case 37://向左滑动，从最左边的方块开始向左移动
      component.sort(function(a, b) {
        if (a.x < b.x) {
          return -1;
        }
        if (a.x > b.x) {
          return 1;
        }
        return 0;
      });
      change = move(-1, 0);
      break;
    case 38://向上滑动，从最上边的方块开始向上移动
      component.sort(function(a, b) {
        if (a.y < b.y) {
          return -1;
        }
        if (a.y > b.y) {
          return 1;
        }
        return 0;
      });
      change = move(0, -1);
      break;
    case 39://向右滑动，从最右边的方块开始向右移动
      component.sort(function(a, b) {
        if (a.x > b.x) {
          return -1;
        }
        if (a.x < b.x) {
          return 1;
        }
        return 0;
      });
      change = move(1, 0);
      break;
    case 40://向下滑动，从最下边的方块开始向下移动
      component.sort(function(a, b) {
        if (a.y > b.y) {
          return -1;
        }
        if (a.y < b.y) {
          return 1;
        }
        return 0;
      });
      change = move(0, 1);
      break;
  }
  if (change > 0) {
    addTiles(1);
  }

  if (checkDefeat()) {
    document.querySelector(".game-message p").innerText = "Game Over!";
    document.querySelector(".game-message").classList.add("game-over");
  }

}
//删除特效类
function removeAll(cName){
	var elements = document.querySelectorAll("."+cName);
	if(cName=="tile-new")
  		elements.forEach(function(item){item.classList.remove("tile-new");});
  	if(cName=="tile-merged")
  		elements.forEach(function(item){item.classList.remove("tile-merged");});
  	if(cName=="score-addition")
  		elements.forEach(function(item){item.parentNode.removeChild(item);});
}
//移动方块
function move(dx, dy) {
  var change = 0;
  for (var i = 0; i < component.length; i++) {
    while (isMovePossible(component[i].x, component[i].y, dx, dy)) {
      makeMove(i, dx, dy);
      change++;
      if (component[i].x != -1 && component[i].y != -1) {
        component[i].x += dx;
        component[i].y += dy;
      }
    }
  }

  checkTrash();
  return change;
}
//检查是否可以移动
function isMovePossible(x, y, dx, dy) {
  var newX = x + dx;
  var newY = y + dy;

  if (newX < 4 && newX >= 0 && newY < 4 && newY >= 0) {
    if (matrix[newX][newY] == 0) {
      return true;
    } else if (matrix[newX][newY] == matrix[x][y]) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
//移动方块操作
function makeMove(i, dx, dy) {
  var x = component[i].x;
  var y = component[i].y;
  var newX = x + dx;
  var newY = y + dy;
  var newValue = matrix[x][y] + matrix[newX][newY];

  if (matrix[newX][newY] == matrix[x][y]) {
    component[i].x = -1;
    component[i].y = -1;
    score += newValue;
    document.querySelector(".score-container").innerHTML = score + "<div class='score-addition'>+" + newValue + "</div>";
    if (score > best) {
      best = score;
      document.querySelector(".best-container").innerText = best;
    }
  }

  matrix[newX][newY] = newValue;
  matrix[x][y] = 0;
  var removeI = document.querySelector('.tile-position-' + (newX+1) + '-' + (newY+1) + '');
  if(removeI != null) {
  	matrix[newX][newY] = -newValue;
  	removeI.parentNode.removeChild(removeI); 
  	updateTile(newX, newY,'tile-merged');
  }else{
  	updateTile(newX, newY,'');
  }
  removeI = document.querySelector('.tile-position-' + (x+1) + '-' + (y+1) + '');
  removeI.parentNode.removeChild(removeI);
  

  if (newValue == 2048) {
  	document.querySelector(".game-message p").innerText = "Congratulations!";
    document.querySelector(".game-message").classList.add("game-won");
  }
}
//在component中删除两数合并后空白位置的方块信息并恢复matrix数组
function checkTrash() {
	var x,y;
  for (var i = 0; i < component.length; i++) {
  	x = component[i].x;
  	y = component[i].y;
    if (x == -1 && y == -1) {
      component.splice(i, 1);
    }else if(matrix[x][y]<0){
    	matrix[x][y] = -matrix[x][y];
    }
  }
}
//检查是否游戏结束
function checkDefeat() {
  if (component.length == 16) {
    for (var i = 0; i < component.length; i++) {
      for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
          if (x != y && Math.abs(x) != Math.abs(y)) {
            if (isMovePossible(component[i].x, component[i].y, x, y)) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }
}
