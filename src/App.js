import './App.css';
import React, { useState, useEffect } from 'react';

async function getMapsets(setter, setter2) {
  let arr = [];
  let tags = [];
  const response = await fetch(`${process.env.REACT_APP_API_URL}/maps`);
  const d = await response.json();
  for (let dd of d) {
    arr.push(dd);
    if (dd.maps[0].tags) {
      if (dd.maps[0].tags.includes(',')) {
        dd.maps[0].tags.split(',').forEach(t => {
          if(tags.indexOf(t.trim().toLowerCase()) === -1) {
            tags.push(t.trim().toLowerCase())
          }
        });
      } else {
        dd.maps[0].tags.split(' ').forEach(t => {
          if (tags.indexOf(t.trim().toLowerCase()) === -1) {
            tags.push(t.trim().toLowerCase())
          }}
        );
      }
    }
    setter(arr);
    setter2(tags);
  }
}

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);
  const [isAsc, setIsAsc] = useState(true); 
  const [include7k, setInclude7k] = useState(false);

  useEffect(() => {
    getMapsets(setData, setTags);
  }, []);

  

  return (
    <div className="App">
      {data.length ? null : <h1>LOADING</h1>}
      {tags.length ?
      <div>
      <datalist id="opts">
        {tags.filter(f => search ? f.toLowerCase().includes(search.toLowerCase()) : true).map(t => {
          return <option value={t}>
            {t}
          </option>
        })}
      </datalist> 
      </div>
      : null}
      {data.length ? <input list="opts" value={search} onChange={(e) => setSearch(e.target.value)} /> : null}
      <div>
        <button onClick={() => setIsAsc(!isAsc)}>
          {isAsc ? 'ASC' : 'DESC'}
        </button>
      </div>
      <div>
        <button onClick={() => setInclude7k(!include7k)}>
          {include7k ? '7K Included' : '7K Not Included'}
        </button>
      </div>
      <div>
      {data.filter(d => search ? d.maps[0].tags.toLowerCase().includes(search.toLowerCase()) : true).map(d => 
        <div>
          { 
            d.maps.sort((m1, m2) => isAsc ? m1.difficulty_rating - m2.difficulty_rating : m2.difficulty_rating - m1.difficulty_rating).map((map, idx) => 
              include7k || map.game_mode == 1 ? <div>
                <a href={`https://quavergame.com/mapset/map/${map.id}`} target="_blank" style={{ fontSize: '12px', paddingLeft: '40px'}}>
                  {map.artist + ' - ' + map.title + ' (' + map.difficulty_name + ' - ' + map.difficulty_rating + ')'}
                </a>
              </div> : null
            )
          }
          <div>

          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
