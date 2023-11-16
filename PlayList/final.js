const { google } = require("googleapis");
const ExcelJS = require("exceljs");
const { log } = require("./log");

const filePath = "./exceljk.xlsx";
const sheetName = "Sheet1";

const apiKey = "AIzaSyC7SYNkhrDcniF19n9n7Izi6RA-4EI2kfM";

async function getPlaylistDetails(playlistId) {
    // log("inside getPlaylistDetails functon -- " + playlistId);

    const youtube = google.youtube("v3");

    try {
        const response = await youtube.playlists.list({
            key: apiKey,
            part: "snippet",
            id: playlistId,
        });

        // Handle the API response data

        // log(response.data.items[0])
        const playlistDetails = response.data.items[0].snippet;
        return playlistDetails;
    } catch (error) {
        // log("Error fetching playlist details:", error.message);
        return false;
    }
}

async function getPlaylistVideos(playlistId1, playlistTitle) {
    const youtube = google.youtube("v3");

    log("Inside playlist videos ---- " + playlistId1, playlistTitle)
    let nextPageToken = null;
    let videoDataRow = [];

    do {
        const response = await youtube.playlistItems.list({
            key: apiKey,
            part: "snippet",
            playlistId: playlistId1,
            maxResults: 50, // You can adjust this number based on your needs
            pageToken: nextPageToken,
        });

        // Handle the API response data
        const videos = response.data.items;

        videos.forEach((video) => {
            // console.log('Video Title:', video.snippet.title);
            // console.log('Video ID:', video.snippet.resourceId.videoId);
            // console.log('-----------------------');

            log(videoDataRow.length);

            videoDataRow.push([playlistId1, playlistTitle, video.snippet.resourceId.videoId, video.snippet.title]);
        });

        nextPageToken = response.data.nextPageToken;
    } while (nextPageToken);

    log("All videos fetched from the playlist.");
    return videoDataRow;
}

async function appendToExcelSheet(filePath, sheetName, rows) {
    const workbook = new ExcelJS.Workbook();
    let worksheet;

    try {
        // Load existing workbook or create a new one if it doesn't exist
        await workbook.xlsx.readFile(filePath).catch(() => workbook.xlsx.writeBuffer());
        worksheet = workbook.getWorksheet(sheetName) || workbook.addWorksheet(sheetName);

        // Append values to the worksheet
        worksheet.addRows(rows);

        // Save the workbook
        await workbook.xlsx.writeFile(filePath);

        log("Rows appended successfully.");
    } catch (error) {
        log("Error appending rows to Excel sheet:", error.message);
    }
}

(async () => {
    let PlaylistRow = [
"PL40DAC4395F61A174",
"PL687BC66F5D23C628",
"PLBA9E146A253BD130",
"PLC7407451F9C0B6B5",
"PLE18BBB6303BC6B6D",
"PLE9057097FD34A1B4",
"PLHNUWAqhIXY0_qN44NYGTCXE1F1sxLJqj",
"PLHNUWAqhIXY0_xCv6w6Emr0A5HvryN1lk",
"PLHNUWAqhIXY00cXnmXzAbq8CnZ0n1IDyh",
"PLHNUWAqhIXY018MaxthXaXeTXTjVRB7fx",
"PLHNUWAqhIXY01OGjpjFEDH4pUloKfnyzQ",
"PLHNUWAqhIXY05nEC1GtRjDg913CHPIgpU",
"PLHNUWAqhIXY06ES0mmc8dSMkaJear3HZp",
"PLHNUWAqhIXY0a5PtTGGS-1xia9d4ztGgt",
"PLHNUWAqhIXY0Cr5NgrMuXTpWwe-GGEo8p",
"PLHNUWAqhIXY0deFDyeU4ippj91T6ER7Pe",
"PLHNUWAqhIXY0DN8FynnhTRTjyxobry9Bu",
"PLHNUWAqhIXY0e6YPSfYkx0BFfMi8CsFbU",
"PLHNUWAqhIXY0euZOlUdTvry30CMMtgmRh",
"PLHNUWAqhIXY0hySEdgQIpnzz7THvULTRV",
"PLHNUWAqhIXY0I9TblP9_wQ1ujbMjLhJmC",
"PLHNUWAqhIXY0N-VnX7N_tum280aQIe-j5",
"PLHNUWAqhIXY0O2nLaHLCW4c6QZlDdaPO5",
"PLHNUWAqhIXY0Oofj8fjye9xPVR08gTWBn",
"PLHNUWAqhIXY0oVgSgMqzCXVAeTNBKsAmW",
"PLHNUWAqhIXY0R9JLDypzoW8D6ISbPY1R0",
"PLHNUWAqhIXY0RvL9zwmTz-VfntyormXAQ",
"PLHNUWAqhIXY0WARVLCbEIpRa8hvUVlYZO",
"PLHNUWAqhIXY0YTUjqZLnSh-VRELBVSHSR",
"PLHNUWAqhIXY10etwGxbkvNvkqiEKJJC85",
"PLHNUWAqhIXY11Z64fXLh98I3mF7OvRBtK",
"PLHNUWAqhIXY18q1F_Xj56zGn0_owy7gO_",
"PLHNUWAqhIXY1dXuehW1uhC350w18gIphg",
"PLHNUWAqhIXY1dzO8DL_xqJjHLiM5FapXm",
"PLHNUWAqhIXY1ecRJr32ehwPcxv-pdPhmU",
"PLHNUWAqhIXY1Ew95gDgjujfRQE9lZ7wFX",
"PLHNUWAqhIXY1I77r7x6etIjiQwa7drnd6",
"PLHNUWAqhIXY1InYdLcggimxw027Ruf4yx",
"PLHNUWAqhIXY1J0LIcTFgvCg9IyURKFo1Y",
"PLHNUWAqhIXY1k36nsb0twB6f8RfgQoxzx",
"PLHNUWAqhIXY1LG3s3RYZEJzIp-utv9mW-",
"PLHNUWAqhIXY1MDanU-WVkAbULbtEMW3S_",
"PLHNUWAqhIXY1MPhRf8H9_IXRQ1Zyymxeu",
"PLHNUWAqhIXY1OdWm_J3Wf_x-Weaii0Htm",
"PLHNUWAqhIXY1OfAtSfxWr4ixRN4wyTDMI",
"PLHNUWAqhIXY1omonJPK4VeVVyCTlNuhmK",
"PLHNUWAqhIXY1pr1b_f_ks9Do7uS7iP4Bt",
"PLHNUWAqhIXY1QIN4Ooi3zSyqvIl8kUAVD",
"PLHNUWAqhIXY1RuWhKCkkZ_vvIvPrInOOu",
"PLHNUWAqhIXY1T_MtFqz2OabrJDngb-L8W",
"PLHNUWAqhIXY1tVZ3XbuyUHA0IDFRe_xna",
"PLHNUWAqhIXY1U0cQNA4x_ZDEUH7MBy0WS",
"PLHNUWAqhIXY1V-YShCKT4-EQDkz_my-lV",
"PLHNUWAqhIXY1WWXAQIofPxuJyAWazesil",
"PLHNUWAqhIXY1y7XXdKXWZjw0xK5wP0K2V",
"PLHNUWAqhIXY1YYU_u6g98CJRIFNW1qDp8",
"PLHNUWAqhIXY203r4rezEGrpZ5X7g_u6qI",
"PLHNUWAqhIXY20671ODb4Xbcf5aWmxGWZC",
"PLHNUWAqhIXY22k39ojul9ohCK0Up_-Cvc",
"PLHNUWAqhIXY23Zg5GFGszc-ScXtf8mq77",
"PLHNUWAqhIXY25DS5mhIwkxosaXgcqdhJN",
"PLHNUWAqhIXY27gPVxBWvtyRgOINUJfP9z",
"PLHNUWAqhIXY27YSSDNQMIJHtZ3qEs8FEj",
"PLHNUWAqhIXY2aaRezem9sU2pu5KggsSWO",
"PLHNUWAqhIXY2byX_WrGt2VI4SceyQhSPF",
"PLHNUWAqhIXY2CuHC8xNsqGxm-C2b-Ha4A",
"PLHNUWAqhIXY2E9RMRW7pHEhTm5yNXtUmw",
"PLHNUWAqhIXY2gHZVmO52C2fsVW5VmLm1Z",
"PLHNUWAqhIXY2gJUTgqiLTNrII6kRXAvVI",
"PLHNUWAqhIXY2IbyKx-AvMiwgdaTQ0ydWD",
"PLHNUWAqhIXY2IlgeoM7EpCyjwShMncLSX",
"PLHNUWAqhIXY2IujHJSGIOrEArBQBw65NP",
"PLHNUWAqhIXY2L0gKIFLi2SYegQddnRsep",
"PLHNUWAqhIXY2lnWRF9IC5iNA1KGPa0qcN",
"PLHNUWAqhIXY2nJ-ZrMoIqMRgMWYsc5_pI",
"PLHNUWAqhIXY2o2yyP5DkVDOPcyu-TDjjj",
"PLHNUWAqhIXY2oq--MUrSm9yPDeHS7BBAH",
"PLHNUWAqhIXY2ou9vU9VFQu61_m_3swGBh",
"PLHNUWAqhIXY2PhWcqRsl9cjgvPrDKGUtX",
"PLHNUWAqhIXY2ppxlzu50b_iCZUJhbximD",
"PLHNUWAqhIXY2QlmafQRItDchsA_jPg9wX",
"PLHNUWAqhIXY2RXC2I2WGhQrus5VD-mPWt",
"PLHNUWAqhIXY2S3Cz-UJC-UbLNiyxCjzLE",
"PLHNUWAqhIXY2Te9MAX5zmkk_NFPbq3tZz",
"PLHNUWAqhIXY2U2BtYHZVuxgB_powuXpRD",
"PLHNUWAqhIXY2UnT5rC4Zz5MftWPM4iOBr",
"PLHNUWAqhIXY2URdHayWcMk7ckAzEgmiAU",
"PLHNUWAqhIXY2vu7TzLuF7-MfzVlR8ktpg",
"PLHNUWAqhIXY2x5g3R6gUo9nncZkzeXQme",
"PLHNUWAqhIXY3_D45yJP3TF-KOpX0Kc9iV",
"PLHNUWAqhIXY3-a3Qr6IvPXfkWUHf1Sfa3",
"PLHNUWAqhIXY3-bOw3xOMN3k0WmBn3Pe8z",
"PLHNUWAqhIXY3-WqRbviaKnnKOeaYa4Lo0",
"PLHNUWAqhIXY30-EkToV_gy7qf1nw3pkMK",
"PLHNUWAqhIXY33nwbyoY6qW3nz-dED9iRz",
"PLHNUWAqhIXY376ENW9FJN7pohowoODbJ9",
"PLHNUWAqhIXY3AiJku-1UNFVjNRPwOjNyb",
"PLHNUWAqhIXY3AmAaHgQZBTvIi-5ggz1X4",
"PLHNUWAqhIXY3BZ85WDR707qrm1OyD0OQQ",
"PLHNUWAqhIXY3DAbR_5zvX3Ae4E618EHut",
"PLHNUWAqhIXY3dsdIVj4orImMiP9HOsTCJ",
"PLHNUWAqhIXY3E1K6uv71g4anEtcU990F_",
"PLHNUWAqhIXY3ErLqCBvDzjppvcFwJiPeo",
"PLHNUWAqhIXY3HjLky9X_w2EajxkJPQqgP",
"PLHNUWAqhIXY3HX6B0xGyRWPqtpsAleLVS",
"PLHNUWAqhIXY3JMyCVuav7Mykqsa4e1qzf",
"PLHNUWAqhIXY3js2gavHDGQ2NZ1sBAsQkr",
"PLHNUWAqhIXY3ndzV5BprmrbV-GfTctIBc",
"PLHNUWAqhIXY3QWuO0WrH7nZo4w9XbZ8qE",
"PLHNUWAqhIXY3smRE7wtALTBnjA_MlwQI4",
"PLHNUWAqhIXY3WNTGiJpU5PyH634HqnNRW",
"PLHNUWAqhIXY3wvLS0jETaECIul34r6Xgw",
"PLHNUWAqhIXY3XeuhHY-23sxHD4LAc-bgv",
"PLHNUWAqhIXY3XFpn26h2syjRpRSdzQUc2",
"PLHNUWAqhIXY3Y937mZPPJuss-ZDqha784",
"PLHNUWAqhIXY3yuShUYX5BjyOTGvdlPYRt",
"PLHNUWAqhIXY3Z6VVa8QvR5uPkapzcTsCv",
"PLHNUWAqhIXY3ZHRZLIdpsLBE_-PBQdAHw",
"PLvP9u6s1SggA09VM7Tn_op5J5MCnaFAPi",
"PLvP9u6s1SggA1KK-rgkpauI81Oo64eQv4",
"PLvP9u6s1SggA2cXGDUkefF-lsYzMUcAuK",
"PLvP9u6s1SggA2KsMg8hu8H46D4t3_ps9c",
"PLvP9u6s1SggA3MZpp61h-L0W99hRKEKBd",
"PLvP9u6s1SggA4DUtf3QInLgj-gW_jvLuE",
"PLvP9u6s1SggA51u4YTImaUYoB6CKO36P5",
"PLvP9u6s1SggA5BXznK8LooyN-5mMlPkbV",
"PLvP9u6s1SggA5Cw7zdO7K6wRNAZ5FfEDc",
"PLvP9u6s1SggA5p7DdP7iLSaNGOHTguMYS",
"PLvP9u6s1SggA5vkunEIYKOo0wLiAyG0uB",
"PLvP9u6s1SggA8t5JeHLvJ3ax1fjlf_Bpp",
"PLvP9u6s1SggA94CHgn-D-TiQRF4pRqyJb",
"PLvP9u6s1SggAAbOtIWuHwvP82vY3cWqlX",
"PLvP9u6s1SggABbbzh5-siUs2RYN6-rdwm",
"PLvP9u6s1SggAbUc3SUQm2K1sSFE09B5ZI",
"PLvP9u6s1SggAcXhcoE1necTlQdGEPkwEP",
"PLvP9u6s1SggAge8TjJ6-WRy4yRSbIqSc0",
"PLvP9u6s1SggAgjq7fetXuNwABqiWgFlGg",
"PLvP9u6s1SggAIudEQebGrHBTX-hHAlksy",
"PLvP9u6s1SggAJCcFCGp_LCN8fNLoU_--S",
"PLvP9u6s1SggAJLlqM2XtTWaczEZGa8tqx",
"PLvP9u6s1SggAJRh7f-YtD1DKoRz_vItbt",
"PLvP9u6s1SggAKCBYQ4Eg82cNR_jD5ewRL",
"PLvP9u6s1SggAkH0RF9js8zVMW8Epk9RFg",
"PLvP9u6s1SggAkwZfR-ryFWo8Q1li30aZG",
"PLvP9u6s1SggAlk_tjt9a6FZrVXND87w4G",
"PLvP9u6s1SggALWvIfUsmDWICecLqRUUkD",
"PLvP9u6s1SggAM-7cbcHUooED7CdweBZyY",
"PLvP9u6s1SggAN4dtfm4_3yEgpKEMwibL_",
"PLvP9u6s1SggAni3AxnJB6yUz-ktKhsg-h",
"PLvP9u6s1SggAOEPZJ5WR-LHo7KNztqxPI",
"PLvP9u6s1SggAoGQqzXDYZs1xmXbkNp-2m",
"PLvP9u6s1SggAoH2DJtvXxj03dOIqMn2uE",
"PLvP9u6s1SggAONCbW0neXwwDJ9wWKqkqH",
"PLvP9u6s1SggAOpAYx5hIX1a3zUA_kLDrB",
"PLvP9u6s1SggAPEq0ODRgm7L5WvjNFv9gH",
"PLvP9u6s1SggAPhJ8NUoZFGK2z6GE_N6CZ",
"PLvP9u6s1SggAPHzoIlZCmCCD3EqMdk4hT",
"PLvP9u6s1SggAPLxHV4J6cYLp6J7NhimEW",
"PLvP9u6s1SggAR2-7EAZNyVBBl9ts71zhx",
"PLvP9u6s1SggAR7Tm44M-HcIaC2IuJ_W3p",
"PLvP9u6s1SggARZeEQrnZo5KdJ5hO7HQyB",
"PLvP9u6s1SggAT1XhBSBixzpkz-MmvZc2A",
"PLvP9u6s1SggAu6g7YNMBYUNZXQ3sTm_q3",
"PLvP9u6s1SggAUywCCOEjQq_g6hkRn2oHI",
"PLvP9u6s1SggAvZdR8ZmsHKOmV5osmYI7-",
"PLvP9u6s1SggAy-mErvcC865DYMSUI7Ot-",
"PLvP9u6s1SggAYRgK9sYV-ohk9y4NNuYii",
"PLvP9u6s1SggAYXNoUeR5TIzdxvdDpYD4L",
"PLvP9u6s1SggB_2H3NRobNREZoudohhjCK",
"PLvP9u6s1SggB_o5gQJuYxYR7PrDPcPsTC",
"PLvP9u6s1SggB--8C2n6PEVMK8AMxCLYBU",
"PLvP9u6s1SggB01OO6pkSdhbtk_Tcct0W5",
"PLvP9u6s1SggB1iw2JrMzf4Al26nDUE4aG",
"PLvP9u6s1SggB3KVCo-kKiwfTKAYr1uTeW",
"PLvP9u6s1SggB41Jk-ypR3TmDYhXD7SgUd",
"PLvP9u6s1SggB44MkzsoJXnRYDMwvQyutr",
"PLvP9u6s1SggB59TWjFj-VkE4E7MS9kGQ2",
"PLvP9u6s1SggB6jRLe3BnSvQrd8wGHG0TV",
"PLvP9u6s1SggB87zBglwbL7o3QSCGZBHTc",
"PLvP9u6s1SggB9qKAVUz5plC4Bre3DTPFu",
"PLvP9u6s1SggBa5D3o-IpN75sXTJFMhsA3",
"PLvP9u6s1SggBadd8NiRounnmiNsXQIh1v",
"PLvP9u6s1SggBaSVDwTK_idMmuO9c5iFdQ",
"PLvP9u6s1SggBB-5zDcKqGoLocwj9-X2xO",
"PLvP9u6s1SggBcYWRXZRwjiDq8C9rrnHp4",
"PLvP9u6s1SggBDYZqXFOI4dokmGuvlp_T2",
"PLvP9u6s1SggBe10QkXCOLls3E-qDOkbGI",
"PLvP9u6s1SggBeEPl7GulfgFBoWXm7EW59",
"PLvP9u6s1SggBEtCx5CEt3wideEe5RPjoR",
"PLvP9u6s1SggBEvS9jWymhCWveos4t4oTi",
"PLvP9u6s1SggBeWbYpJLkwnEWP3NdjRXGB",
"PLvP9u6s1SggBf-7aO1WZhplCi4SlZgRsN",
"PLvP9u6s1SggBiXmjRFcsu6ahVzvrpDMXz",
"PLvP9u6s1SggBJ3R5X5x4BPgscktrflLSL",
"PLvP9u6s1SggBJqOQFk3pjeBblzbq-nL26",
"PLvP9u6s1SggBkJaJpQWU5hnUHNyRmiiFQ",
"PLvP9u6s1SggBMcxDpE_d1DezjaTxTChPd",
"PLvP9u6s1SggBmfUjPzY9uaap9jqeZd8YK",
"PLvP9u6s1SggBMIL9H1H1xTD00G-fID-Sb",
"PLvP9u6s1SggBmM2REz5VclvfbBKij3tzM",
"PLvP9u6s1SggBn6Hwvhk9wJa3pbhlHkCOF",
"PLvP9u6s1SggBN8ToiruP5ooSpVHdEDJjm",
"PLvP9u6s1SggBNaLGmfZiSfoWTvTywAAeC",
"PLvP9u6s1SggBNW9QbTltvsTdznFFxSiWa",
"PLvP9u6s1SggBorlkNiO5uTPRMQrRtSwL3",
"PLvP9u6s1SggBOWDx-O9G8PTKaN20qgfTI",
"PLvP9u6s1SggBpK9pmPK_C_8fw4QWdh3eP",
"PLvP9u6s1SggBprOGSKI5smkJLhJbVP6Jw",
"PLvP9u6s1SggBqQSPLSJTe38JIrMXV1XDg",
"PLvP9u6s1SggBQTwEL3WVQ--5i7fZLTCCi",
"PLvP9u6s1SggBrjXG6tEhycfPKXT8aHYAL",
"PLvP9u6s1SggBsm848RkmRetBZxRrU_mM8",
"PLvP9u6s1SggBStg7qPXoJ82MdC2otohA-",
"PLvP9u6s1SggBSXkdeid92oFbrm8p43srt",
"PLvP9u6s1SggBvDqagErJrH7fOzygig3a5",
"PLvP9u6s1SggBVJxabbt_2cb8VvWf9QKFC",
"PLvP9u6s1SggBvSqUtjF5sujK935k7M6rY",
"PLvP9u6s1SggBw-WqKTm_6wSwBIc3F36Pd",
"PLvP9u6s1SggBw8XO_UXhfJW3-MpFJarxE",
"PLvP9u6s1SggBwxrI-z3hsltuq5-n3-SaN",
"PLvP9u6s1SggBx9GupaDWdEQb_ihjTFQ7d",
"PLvP9u6s1SggBXUCakCDTsv9i7yYaQPTBB",
"PLvP9u6s1SggBY2Qoxjumh-b2W6rKoj6RJ",
"PLvP9u6s1SggBYN-goDuohoZXsmLfrAZwq",
"PLvP9u6s1SggBZfESC81wVPhzudC3t6S8m",
"PLvP9u6s1SggC_ZoQVA35bL9xMKhRyd5V2",
"PLvP9u6s1SggC-7OvVYOBa7n2XSTqMHDt3",
"PLvP9u6s1SggC15CR2ufcK8uU32afH2wVV",
"PLvP9u6s1SggC4OEEIe1hqbIK3Q9U7hfbv",
"PLvP9u6s1SggC54lu9WhU2-mDWwg42nXc4",
"PLvP9u6s1SggC5Kze7yoMZNm8pGE6gJYY3",
"PLvP9u6s1SggC7PK5hrA28aqDKSrDZMmm4",
"PLvP9u6s1SggC8ZowO9S86AYZqadIsVnvb",
"PLvP9u6s1SggC9zljkyJ4X8Xb4GQuML40o",
"PLvP9u6s1SggCBc46MeY2H71eYx22afB_y",
"PLvP9u6s1SggCBrAcUqK_B8vhJC39cQhC3",
"PLvP9u6s1SggCBybnCdyyCjj1V2az7ndO3",
"PLvP9u6s1SggCcu1BrVMP6WDoC-n4QP9mg",
"PLvP9u6s1SggCeEv4sljCoHUCFMK5VwpKS",
"PLvP9u6s1SggCesbq36W0wsHf2Nnua31xl",
"PLvP9u6s1SggCeyHvivexzqLbKysvsc14L",
"PLvP9u6s1SggCFZT0b3z_T2oQdb69bWhFv",
"PLvP9u6s1SggCHDE4DAaCk-U-FNw_tBbjH",
"PLvP9u6s1SggChECkKrITFOky3KFDI_g77",
"PLvP9u6s1SggChIe3Ey25gsVeMk4BzFD0k",
"PLvP9u6s1SggCiLs9DeoAUhmp2qsBWHeay",
"PLvP9u6s1SggCjgGxVqOrC-kt1OIrelaws",
"PLvP9u6s1SggCJlVAGEolLkI3tgH0KBR9u",
"PLvP9u6s1SggCjyAolhIanTP2Sl6ZTEOxY",
"PLvP9u6s1SggCk1zAO6wFXS0eKOMPMfutt",
"PLvP9u6s1SggCk3IKLZ5ESJGyEvVKFQI-y",
"PLvP9u6s1SggCKH6QIQGhw-5jWXTPXmnHO",
"PLvP9u6s1SggCkqutlGU8BoE8CVS600Hk8",
"PLvP9u6s1SggCMhBMwaO6SQulGliCFsJtg",
"PLvP9u6s1SggCMntsg-LiHGXRlcz7jl5hD",
"PLvP9u6s1SggCNiCLqhJkloZdyaVMM5uzu",
"PLvP9u6s1SggCPBkAbMv6yXhbceLK95Qyp",
"PLvP9u6s1SggCPZnOOT36fNObHJHdT-e-R",
"PLvP9u6s1SggCri08xd75leou0MEeZKz9e",
"PLvP9u6s1SggCRS9HILmwM5qTQ14XOHO3x",
"PLvP9u6s1SggCsPxfItIKHbNOb9wtnA-bY",
"PLvP9u6s1SggCsT_irxtuaD8vC2J71Dpwl",
"PLvP9u6s1SggCT1MX2qVgFP9sqa6VFppT_",
"PLvP9u6s1SggCtvptNsSU658OPqqgp9l2e",
"PLvP9u6s1SggCU1F_DVNGH7IzQMtnbFkJg",
"PLvP9u6s1SggCUO2Frl0PkXVPO93U2b4ar",
"PLvP9u6s1SggCX9zd3BMf0uqB5_rF7E9D3",
"PLvP9u6s1SggCy0R_GAFxpVMsh73mFKkIP",
"PLvP9u6s1SggCYGeskeW894ydWjyyMNzvQ",
"PLvP9u6s1SggCyPZKNjaga6GE1qmryyP1b",
"PLvP9u6s1SggCyTlCvYvylUIxfvQgTaFMq",
"PLvP9u6s1SggD8iITHwxZsUuerCC6I8MOY",
"PLvP9u6s1SggD9LheEDPbplQH1h_UC2Rhv",
"PLvP9u6s1SggDaHhwumg7M7YuGcVdV8CIJ",
"PLvP9u6s1SggDAKZVc-d6C0w9kbRUHca0J",
"PLvP9u6s1SggDcBqmec_YW8x5vwf1t-KIk",
"PLvP9u6s1SggDci7kAL826iVZUvpSOBHFL",
"PLvP9u6s1SggDCNe7TWlH5MGMtiOvgKafw",
"PLvP9u6s1SggDczxVwXYQYiFhtBWq_tkGi",
"PLvP9u6s1SggDeCg9j5ZzZA6eb1kjpKseG",
"PLvP9u6s1SggDEN9bLpGwqHWD3SX9dQr6C",
"PLvP9u6s1SggDevcqjWAzuuwqUpv4WK1mb",
"PLvP9u6s1SggDEzjknWdVuZ8Uay1fjkr4l",
"PLvP9u6s1SggDf2UuM2S2U9meJJnOTjlwB",
"PLvP9u6s1SggDfdu3RrjTJ9qtVMSdgg10b",
"PLvP9u6s1SggDFoJvsAXqAisAivwMeDfoz",
"PLvP9u6s1SggDH6cYsPgdsf3gsELe_SsIT",
"PLvP9u6s1SggDHcMDNF4gvoWelIj4S1FDH",
"PLvP9u6s1SggDibUTBpuRiqAH-jj6bzpZN",
"PLvP9u6s1SggDkRQXagPAvajey1tugk4Hi",
"PLvP9u6s1SggDl5o-ESSinCdXNH0FuTyl8",
"PLvP9u6s1SggDLF9AIfXbakjiVAYnJcB1j",
"PLvP9u6s1SggDLqjUdmP9C5r2on8UWy-dN",
"PLvP9u6s1SggDmkILTY-3VY8uI7KXPSAZh",
"PLvP9u6s1SggDmkWgC0LKXSVa8M5xz4JUK",
"PLvP9u6s1SggDMOSYcodJ7Cr5iLFE2HW7f",
"PLvP9u6s1SggDnZDY95LucRVNVxh7o7ZHa",
"PLvP9u6s1SggDPNK4Krax5LTmpt6Zcd5t_",
"PLvP9u6s1SggDQbY5aw9JWU5l_wjIfY_ml",
"PLvP9u6s1SggDR-61pfqQ527U0BfE8D-qa",
"PLvP9u6s1SggDrOUKzITTVlYEKTw6-9HaM",
"PLvP9u6s1SggDrq7IIIcd-R6gOlYf43Sr_",
"PLvP9u6s1SggDSwCg3SWv-pxCQz0OdQ8cc",
"PLvP9u6s1SggDtkTucgSYtCfc9ytdRxHrG",
"PLvP9u6s1SggDTwirPaK2msv_Yz6biL5yT",
"PLvP9u6s1SggDUaxhTh5GV61DwNSVOITIr",
"PLvP9u6s1SggDuca_jWp63gQZ_m3ExtoB1",
"PLvP9u6s1SggDuEZ2pqGKAkAiY9wGxq3vd",
"PLvP9u6s1SggDUn74yYkNLDsnTL_b53m25",
"PLvP9u6s1SggDVJ858UKw7qmUzvjLc_Mul",
"PLvP9u6s1SggDvL735jwkRbN7JP1lq-N4A",
"PLvP9u6s1SggDw35X6hTsBc-Ew4h4F8kGG",
"PLvP9u6s1SggDWLEu7Rwvmgc9jI6Zu764s",
"PLvP9u6s1SggDWoJfnVWg6YAcDa3NijEUa",
"PLvP9u6s1SggDYyLWd6gHpjnUjxXa4cJSd",
"PLvP9u6s1SggDYzqoU94pw6LRCy0g_dICK",
"PLvP9u6s1SggDzVTOKUh5qrpcpBwEVIXlE",
];

    log("All the Ids are fetched --- move next");
    setTimeout(async () => {
        for (i = 0; i < PlaylistRow.length; i++) {
            let res = await getPlaylistDetails(PlaylistRow[i]);
            var PlayListTitle = "";
            var playlistID = PlaylistRow[i]

            if (!res) {
                PlayListTitle = "Private";
            } else {
                PlayListTitle = res.title;
            }

            log("Plylist id and title from playlistDetails function ---- " + PlaylistRow[i] + " --- Title ---  " + PlayListTitle);
            // setTimeout(async () => {

                log("Plylist id and title from playlistDetails function 2 ---- " + playlistID + " --- Title ---  " + PlayListTitle);
                if (PlayListTitle != "Private") {
                    let videoDataRow = await getPlaylistVideos( playlistID , PlayListTitle);
                    log(videoDataRow);

                    if (!videoDataRow) {
                        log("Vidodata row is false -- " + videoDataRow);
                    } else {
                        log(" ----- Data will be appended to excel sheet ---- " + videoDataRow.length);
                        setTimeout(async () => {
                            await appendToExcelSheet(filePath, sheetName, videoDataRow);
                        }, 10000);
                    }
                } else {
                    log("--- Playlist is private no append to excel sheet --- ");
                }
            // }, 5000);
        }
    }, 5000);
})();

module.exports = {
    getPlaylistDetails,
};
