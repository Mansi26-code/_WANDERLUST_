<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Navbar with Centered Search Bar</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/css/bootstrap.min.css">
    <style>
        .navbar {
            padding: 1rem 2rem;
        }

        .btn-search {
            background-color: #fe424d;
            color: #fff;
            border-radius: 20px;
            width: 120px;
        }

        .btn-search:hover {
            background-color: #fe424d;
            color: #fff;
            width: 120px;
        }

        .form-control {
            border-radius: 40px;
            width: 200px;
            padding: 0.5rem 1rem;
            border: 1px solid #ced4da;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .form-control:focus {
            border-color: #80bdff;
            box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .search-container {
            display: flex;
            justify-content: center;
            flex: 1;
        }

        .search-container input {
            border-radius: 50px;
            padding: 0.5rem 3rem;
            font-size: 1rem;
        }

        .navbar-nav {
            display: flex;
            align-items: center;
        }

        .navbar-brand {
            margin-right: 2rem;
        }

        @media (max-width: 768px) {
            .navbar-nav {
                flex-direction: column;
                align-items: flex-start;
            }

            .search-container {
                width: 100%;
                justify-content: flex-start;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-md bg-body-light border-bottom sticky-top">
        <div class="container-fluid">
            <a class="navbar-brand" href="/listings"><i class="fa-regular fa-compass"></i></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div class="navbar-nav">
                    <a class="nav-link" href="/listings">Explore</a>
                </div>
                <div class="search-container">
                    <form class="d-flex" role="search" action="/search" method="GET">
                        <input class="form-control me-2" type="search" name="q" placeholder="Search Destination" aria-label="Search">
                        <button class="btn-search" type="submit"><i class="fa-solid fa-magnifying-glass"></i> Search</button>
                    </form>
                </div>
                <div class="navbar-nav ms-auto">
                    <a class="nav-link" href="/listings/new">Home for tourists</a>
                    <% if(!currUser){ %>
                        <a class="nav-link active" href="/signup"><b>SignUp</b></a>
                        <a class="nav-link" href="/login"><b>Login</b></a>
                    <% } %>
                    <% if(currUser){ %>
                        <a class="nav-link" href="/logout">Logout</a>
                    <% } %>
                </div>
            </div>
        </div>
    </nav>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.11.6/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/js/bootstrap.min.js"></script>
</body>
</html>

  
