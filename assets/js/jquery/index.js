// add campground
// $("#add_campground").submit(function (event) {
//     alert("Data Inserted Successfully");
// })

// update campgrounds load

// update user 
// $("#update_user").submit(function (event) {
//     event.preventDefault();

//     var unindexed_array = $(this).serializeArray();
//     console.log(unindexed_array);
//     var data = {}

//     $.map(unindexed_array, function (n, i) {
//         data[n['name']] = n['value']
//     })

//     var request = {
//         "url": `http://localhost:8080/api/users/${data.id}`,
//         "method": "POST",
//         "data": data
//     }

//     $.ajax(request).done(function (response) {
//         alert("Data Updated Successfully!");
//         location.reload();
//     })

// })