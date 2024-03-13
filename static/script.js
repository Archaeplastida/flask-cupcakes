axios.get("/api/cupcakes")
    .then(async response => {
        let cupcakes = response.data.cupcakes;
        for (let cupcake = 0; cupcake < cupcakes.length; cupcake++) {
            $(".cupcakes").append(`<li class=${cupcakes[cupcake].id}>Flavor: ${cupcakes[cupcake].flavor}, ${cupcakes[cupcake].size} <button class='edit ${cupcakes[cupcake].id}'>E</button><button class='delete ${cupcakes[cupcake].id}'>X</button><ul><li>Rating: ${cupcakes[cupcake].rating}<br><img style='height:200px' src=${cupcakes[cupcake].image}></img></li></ul></li>`)
        }
    })

$(".cupcakes").on('click', '.delete', async function (event) {
    event.preventDefault();

    let id = $(this).attr('class').split(' ')[1]

    axios({
        method: 'delete',
        url: `/api/cupcakes/${id}`
    })

    $(this).parent().remove()
})

$('.cupcakes-form').on('click', '.submit', async function (event) {
    event.preventDefault();
    $(".flavor").val()
    $(".rating").val()
    $(".image-url").val()
    $(".size").val()

    if ($(".image-url").val()) {
        axios({
            method: 'post',
            url: '/api/cupcakes',
            data: {
                flavor: $(".flavor").val(),
                rating: $(".rating").val(),
                size: $(".size").val(),
                image: $(".image-url").val()
            }
        }
        ).then(async response => {
            let newCupcake = response.data.cupcake
            $(".cupcakes").append(`<li class='${newCupcake.id}'>Flavor: ${newCupcake.flavor}, ${newCupcake.size} <button class='edit ${newCupcake.id}'>E</button><button class='delete ${newCupcake.id}'>X</button><ul><li>Rating: ${newCupcake.rating}<br><img style='height:200px' src=${newCupcake.image}></img></li></ul>`)
        })
    } else {
        axios({
            method: 'post',
            url: '/api/cupcakes',
            data: {
                flavor: $(".flavor").val(),
                rating: $(".rating").val(),
                size: $(".size").val(),
            }
        }
        ).then(async response => {
            let newCupcake = response.data.cupcake
            $(".cupcakes").append(`<li class='${newCupcake.id}'>Flavor: ${newCupcake.flavor}, ${newCupcake.size} <button class='edit ${newCupcake.id}'>E</button><button class='delete ${newCupcake.id}'>X</button><ul><li>Rating: ${newCupcake.rating}<br><img style='height:200px' src=${newCupcake.image}></img></li></ul>`)

        })
    }
    $('.cupcakes-form .flavor').val('')
    $('.cupcakes-form .rating').val('')
    $('.cupcakes-form .size').val('')
    $('.cupcakes-form .image-url').val('')
}
)

$('.cupcakes').on('click', '.edit', async function (event) {
    event.preventDefault()
    let id = $(this).attr('class').split(' ')
    id = id[id.length - 1]
    $('.cupcakes-form .flavor').val('hello bro')
    $('.cupcakes-form .rating').val(14)
    $('.cupcakes-form .size').val('hello bro')
    $('.cupcakes-form .image-url').val('hello bro')

    axios.get(`/api/cupcakes/${id}`)
        .then(async response => {
            let cupcake = response.data.cupcake
            $('.cupcakes-form .flavor').val(cupcake.flavor)
            $('.cupcakes-form .rating').val(cupcake.rating)
            $('.cupcakes-form .size').val(cupcake.size)
            $('.cupcakes-form .image-url').val(cupcake.image)
            $('.cupcakes-form button').text('SAVE EDIT').removeClass()
            $('.cupcakes-form button').addClass(`editting`).addClass(`${id}`)
        }
        )

})

$('.cupcakes-form').on('click', '.editting', async function (event) {
    event.preventDefault()
    let id = $(this).attr('class').split(' ')
    id = id[id.length - 1]
    axios({
        method: 'patch',
        url: `/api/cupcakes/${id}`,
        data: {
            flavor: $('.cupcakes-form .flavor').val(),
            size: $('.cupcakes-form .size').val(),
            rating: $('.cupcakes-form .rating').val(),
            image: $('.cupcakes-form .image-url').val()
        }
    }).then(async response => {
        let editted_cupcake = response.data.cupcake
        $(`li.${id}`).html(`Flavor: ${editted_cupcake.flavor}, ${editted_cupcake.size} <button class='edit ${editted_cupcake.id}'>E</button><button class='delete ${editted_cupcake.id}'>X</button><ul><li>Rating: ${editted_cupcake.rating}<br><img style='height:200px' src=${editted_cupcake.image}></img></li></ul>`)
        $('.cupcakes-form .flavor').val('')
        $('.cupcakes-form .rating').val('')
        $('.cupcakes-form .size').val('')
        $('.cupcakes-form .image-url').val('')

        $('.cupcakes-form button').text('CREATE CUPCAKE').removeClass().addClass('submit')
    })
})