import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

function Filter({ difficulty, setDifficulty, categories, setCategory }) {
  return (
    <div className="border-solid border-black w-screen h-fit mt-5 flex justify-around">
      <div className="w-fit flex justify-evenly gap-10">
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={difficulty}
              label="Age"
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {["All", "Easy", "Medium", "Hard"].map((e, i) => (
                <MenuItem value={e} key={i}>
                  {e}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <div>
          <Autocomplete
            multiple
            id="tags-outlined"
            style={{ width: "33vw", minWidth: "300px" }}
            options={categories}
            filterSelectedOptions
            getOptionLabel={(option) => option}
            defaultValue={[]}
            onChange={(e, v) => setCategory(v)}
            renderInput={(params) => (
              <TextField {...params} variant="standard" label="Category" />
            )}
          />
        </div>
      </div>
      {/* <div className="border-2 rounded-lg p-2 mr-2">Category</div> */}
    </div>
  );
}

export default Filter;
