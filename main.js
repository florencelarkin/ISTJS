    //IST
    var timeline = [];
    let pointsFixed = 0;
    let pointsDec = 0;
    let fixedWins = 0;
    let decWins= 0;
    let gridTotal = 25; //5x5 grid with 25 squares
    
    
    function getPattern() {
        let yellowCount = 0;
        let blueCount = 0;
        let gridPattern = [];
        for (var i = 0; i < gridTotal; i++) { 
            let number = Math.floor(Math.random() * 2) //either 0 or 1
            if (number === 0) {
                yellowCount++;
                gridPattern.push('yellow'); 
            }
            else {
                blueCount++;
                gridPattern.push('blue');
            } 
        }    
        return gridPattern
    };
    
    function getCorrect(array) {
        var count = 0;
        for(var i = 0; i < array.length; ++i){
        if(array[i] == 'yellow')
            count++;
    }
    count > 12 ? answer = 'yellow, 0' : answer = 'blue, 1'
    return answer
    }
    
    function getPoints() {
        return pointsFixed
    }
    
    function getDecPoints() {
        return pointsDec
    }
    
    function getFixedWins() {
        return fixedWins
    }
    
    function getDecWins() {
        return decWins
    }
    
    //get rid of this if uploading to taskflow
    var id_page = {
      type: jsPsychSurveyText,
      questions: [
        {prompt: 'Participant ID', required: true},
        {prompt: 'Session Number', required: true}
      ]
    }
    
    var gen_instructions = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
          <p>In this task, your goal is to figure out whether there are more blue or yellow squares.
          </p><p>To reveal the squares in the grid, click on them</p>
          <p>When you are ready to choose which color you think is the majority, </p>
          <p>press the yellow for yellow or the blue button for blue. </p>
          
        `,
        choices: ['NEXT'],
        post_trial_gap: 2000
      };
    
      var fixed_instructions = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
          <p>In this version, you can click as many squares as you want without penalty. </p><p>If you are correct, you will win 100 points and if you are wrong you will lose 100 points.</p>
          <p>Press 'START' to begin.</p>
        `,
        choices: ['START'],
        post_trial_gap: 2000
      };
    
      var dec_instructions = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
        <p>In this version, the amount you can win starts at 250 points and decreases for every square you click. </p><p>So revealing every single box means you don\'t gain any points even if you answer correctly.</p>
        <p>If you are incorrect you still lose 100 points no matter what.</p>
        <p>Press 'START' to begin.</p>
        `,
        choices: ['START'],
        post_trial_gap: 2000
      };
    
      var prac_instructions = {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
        <p>This section will give you a chance to practice the task</p><p>Try tapping the grid to reveal the squares underneath</p>
        <p>Don\'t worry about points or winning for this section, they will reset once you start the task</p>
        <p>Press 'START' to begin.</p>
        `,
        choices: ['START'],
        post_trial_gap: 2000
      };
    
    
    
    var fixed = {
        type: jsPsychISTGrid,
        stimulus: getPattern,
        choices: ['yellow', 'blue'],
        points: getPoints,
        wins: getFixedWins,
        data: {
            task: 'response',
            points: ''
          },
        on_finish: function(data){
            if (data.answer === 'yellow, 0' && data.response === 0) {
                pointsFixed = pointsFixed + 100;
                data.points = pointsFixed
                fixedWins++;
                data.text = 'Won!'
                data.wins = fixedWins
            } 
            else if (data.answer === 'blue, 1' && data.response === 1) {
                pointsFixed = pointsFixed + 100;
                data.points = pointsFixed
                fixedWins++;
                data.wins = fixedWins
                data.text = 'Won!'
            }
            else {
                pointsFixed = pointsFixed - 100;
                data.points = pointsFixed
                data.wins = fixedWins
                data.text = 'Lost'
            }
          }
    };
    
    var points_page = {
      type: jsPsychHtmlButtonResponse,
      stimulus: function() {
      return '<p>You '+  jsPsych.data.get().last(1).values()[0].text+ '</p><p>You have '+  jsPsych.data.get().last(1).values()[0].points+ ' points</p><p>Press NEXT to continue.</p>'  },
      choices: ['NEXT'],
      
    };
    
    var practice_points_page = {
      type: jsPsychHtmlButtonResponse,
      stimulus: function() {
      return '<p>You '+  jsPsych.data.get().last(1).values()[0].text+ '</p><p>You have '+  jsPsych.data.get().last(1).values()[0].points+ ' points</p><p>Press NEXT to continue.</p>'  },
      choices: ['NEXT'],
      on_finish: function(data){
            pointsFixed = 0
            data.points = pointsFixed
            fixedWins = 0
            data.wins = fixedWins
          }
      
    };
    
    var decreasing = {
        type: jsPsychISTGrid,
        stimulus: getPattern,
        choices: ['yellow', 'blue'],
        points: getDecPoints, 
        wins: getDecWins,
        decreasing: true,
        data: {
            task: 'response',
            
          },
        on_finish: function(data){
            if (data.answer === 'yellow, 0' && data.response === 0) {
                //give number of points left
                pointsDec = pointsDec + data.potentialPoints
                //console.log(pointsDec)
                data.points = pointsDec
                decWins++;
                data.wins = decWins;
                data.text = 'Won!'
            } 
            else if (data.answer === 'blue, 1' && data.response === 1) {
                //give number of points left
                pointsDec = pointsDec + data.potentialPoints
                //console.log(pointsDec)
                data.points  = pointsDec
                decWins++;
                data.wins = decWins;
                data.text = 'Won!'
            }
            else {
                //if you guess wrong you still lose 100 
                data.wins = decWins;
                pointsDec = pointsDec - 100;
                data.points = pointsDec
                data.text = 'Lost'
                
            }
          }
    };
    
    var end_page = {
        type: jsPsychHtmlButtonResponse,
        stimulus: function() {
          return '<p>Complete!</p><p>You have '+  jsPsych.data.get().last(1).values()[0].wins+ ' wins</p><p>You have '+  jsPsych.data.get().last(1).values()[0].points+ ' points</p><p>Press FINISH to complete the block</p>'}
        ,
        choices: ['FINISH'],
        post_trial_gap: 2000
      };
    
    var fixed_block = {
        timeline: [fixed_instructions, fixed, points_page, fixed, points_page, fixed, points_page, fixed, points_page, fixed, points_page, fixed, points_page, fixed, points_page, fixed, points_page, fixed, end_page]
      };
    
      var decreasing_block = {
        timeline: [dec_instructions, decreasing, points_page, decreasing, points_page, decreasing, points_page, decreasing, points_page, decreasing, points_page, decreasing, points_page, decreasing, points_page, decreasing, points_page, decreasing, points_page, decreasing, end_page],
      };
    
    //randomize whether fixed win or decreasing win is first
    var block_list = [fixed_block, decreasing_block]
    random_order = block_list.sort(() => Math.random() - 0.5)
    //get rid of id page if uploading to taskflow
    timeline.push(id_page, gen_instructions, prac_instructions , fixed, practice_points_page, random_order[0], random_order[1])
    
    
    
      