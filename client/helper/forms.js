const AddForm = (props) => {
  return (
    <form id="addForm"
      onSubmit={handleAdd}
      name="addForm"
      action="/addPage"
      method="POST"
      className="addForm"
    >
      <input id="gameName" type="text" name="name" placeholder="Game Name" value=""/>
      <input id="gameYear" type="text" name="year" placeholder="Game Year" value=""/>
      <input id="gameId" type="text" name="gameId" value=""/>
      <input id="gamePlatform" type="text" name="platform" value=""/>
      <input id="gameCategory" type="text" name="category" value=""/>
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input className="addGameSubmit" type="submit" value="Add Game"/>
    </form>
  );
};

const RemoveForm = (props) => {
  return (
    <form id="removeForm"
      onSubmit={handleRemove}
      name="removeForm"
      action="/remove"
      method="DELETE"
      className="removeForm"
    >
      <input id="gameIdRemove" type="text" name="gameId" value=""/>
      <input type="hidden" name="_csrf" value={props.csrf} />
      <input className="removeGameSubmit" type="submit" value="Remove Game" />
    </form>
  )
}
