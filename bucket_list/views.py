from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from account.models import HaehooUser
from bucket_list.models import Bucket

def total(request):
    total_bucket = Bucket.objects
    return render(request, "total.html", {'total_bucket' : total_bucket})

def private(request, nickname):
    user = HaehooUser.objects.filter(nickname = nickname)
    buckets = Bucket.objects.filter(user = user.get())
    return render(request, "private.html", {"nickname" : nickname, "buckets" : buckets})

def create(request, nickname):
    if request.method == "POST":
        user = HaehooUser.objects.filter(nickname=nickname)
        title = request.POST["title"]
        category = int(request.POST["category"])
        newBucket = Bucket(
            title = title,
            category = category
        )
        newBucket.user = user.get()
        newBucket.save()
        return redirect('private', nickname=nickname)
    else:
        return render(request, "create.html", {"nickname" : nickname})

def delete(request, nickname, bucket_id):
    bucket = get_object_or_404(Bucket, pk = bucket_id)
    bucket.delete()

    return redirect('private', nickname=nickname)

def edit(request, nickname, bucket_id):
    edit_bucket = Bucket.objects.get(id = bucket_id)

    return render(request, 'edit.html', {'bucket' : edit_bucket, 'nickname' : nickname})

def update(request, nickname, bucket_id):
    user = HaehooUser.objects.filter(nickname=nickname)
    edit_bucket = Bucket.objects.get(id=bucket_id)
    edit_bucket.title = request.POST.get('title')
    edit_bucket.category = request.POST["category"]

    edit_bucket.user = user.get()
    edit_bucket.save()

    return redirect('private', nickname=nickname)

def click_like(request, nickname, bucket_id):
    if request.method != "POST":
        return JsonResponse({"message":"Permission denied."})
    bucket = Bucket.objects.get(pk=bucket_id)
    user = HaehooUser.objects.get(nickname=nickname)
    if user in bucket.liked_users.all():
        bucket.liked_users.remove(user)
    else:
        bucket.liked_users.add(user)
    bucket.save()
    return JsonResponse({"message":"OK", "is_contains":user in bucket.liked_users.all(), "like_cnt":bucket.liked_users.count()})

def click_scrap(request, nickname, bucket_id):
    bucket = Bucket.objects.get(pk=bucket_id)
    user = HaehooUser.objects.get(nickname=nickname)
    if request.method == "GET":
        return render(request, 'scrap.html', {'nickname': nickname, 'bucket': bucket})
    if request.method == "POST":
        title = request.POST.get("title")
        category = int(request.POST["category"])
        derived = Bucket(
            user = user,
            title = title,
            category = category,
            derived_bucket = bucket
        )
        derived.save()
        return redirect('total')
    