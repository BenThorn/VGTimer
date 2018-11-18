class App extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return(
      <div className='App'>
        <h3>List</h3>
        <RemoveForm csrf={this.props.csrf} />
        <div id="current">
          <h3>Currently playing</h3>
          <div className="currentList">
          </div>
        </div>
        
        <div id="owned">
          <h3>Own but never played</h3>
          <div className="ownedList">
          </div>
        </div>

        <div id="finished">
          <h3>Finished</h3>
          <div className="finishedList">
          </div>
        </div>

        <div id="hold">
          <h3>On hold</h3>
          <div className="holdList">
          </div>
        </div>

        <div id="dropped">
          <h3>Dropped</h3>
          <div className="droppedList">
          </div>
        </div>
      </div>
    );
  }
};

const GameList = function(props) {
  if(props.games.length === 0) {
    return (
      <div className="gameList">
        <h3 className="emptyGames">No games in your collection.</h3>

      </div>
    );
  }

  const gameNodes = props.games.map(function(game) {
    const node = createGameNode(game, props.currentCategory);
    return node;
  });

  console.log(props.currentCategory, gameNodes);

  if (gameNodes[0] === undefined) {
    return (
      <div className="gameList">
        <p>Currently no games in this category.</p>
      </div>
    )
  } else {
    return (
      <div className="gameList">
        {gameNodes}
      </div>
    );
  }


};

const setup = function(csrf) {
  ReactDOM.render(
    <App csrf={csrf} />, document.querySelector("#content")
  );

  loadGamesFromServer();
};

const loadGamesFromServer = () => {
  sendAjax('GET', '/getGames', null, (data) => {
    const categories = ['current', 'owned', 'finished', 'hold', 'dropped'];

    for(let i = 0; i < categories.length; i++) {
      ReactDOM.render(
        <GameList games={data.games} currentCategory={categories[i]} />, document.querySelector(`.${categories[i]}List`)
      )
    }
  })
};

const createGameNode = (game, currentCategory) => {
  if (game.category === currentCategory) {
    let year;
    // Check if the date wasn't available from the API
    if(game.year === 0) {
      year = 'N/A';
    } else {
      year = game.year;
    }
    return (
      <div key={game._id} className="game">
        <form
          id={game._id}
          className='gameNodeForm'
          onSubmit={handleRemoveGame}
          action="removeList"
        >
          <p className="gameNodeName"> {game.name} </p>
          <p className="gameNodeYear"> {year} </p>
          <p className="gameNodePlatform"> {game.platform} </p>
          <select id="gameNodeCategory" value={game.category}>
            <option value="current">Currently playing</option>
            <option value="owned">Owned, but not played</option>
            <option value="finished">Finished</option>
            <option value="hold">On hold</option>
            <option value="dropped">Dropped</option>
          </select>
          <input type='hidden' id='gameId' value={game.gameId} />
          <input type='submit' value='Remove Game From Collection' />
        </form>
      </div>
    );
  }
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});